from datetime import datetime, timedelta
import time
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import models
import crud
import database
import sse_bus
from typing import List, Optional
from collections import defaultdict
from contextlib import asynccontextmanager
import asyncio
import bleach

def sanitize(value: str) -> str:
    """Strip all HTML/script tags from a string to prevent stored XSS."""
    return bleach.clean(str(value), tags=[], strip=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the background task
    task = asyncio.create_task(process_recurring_transactions_loop())
    yield
    # Optionally cancel task on shutdown
    task.cancel()

app = FastAPI(lifespan=lifespan)

origins = ["*"]

@app.get("/")
def read_root():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database.create_tables()

# --- SSE Events Endpoint ---
@app.get("/events/{user_id}")
async def event_stream(user_id: int):
    """Server-Sent Events stream. Clients subscribe here to receive real-time
    invalidation signals whenever backend data changes for the given user."""
    return StreamingResponse(
        sse_bus.subscribe(user_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )

# User endpoints
@app.post("/users/", response_model=models.User)
def create_user(user: models.User):
    return crud.create_user(user)

@app.get("/users/{user_id}", response_model=models.User)
def read_user(user_id: int):
    db_user = crud.get_user(user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=models.User)
def update_user(user_id: int, user: models.User):
    db_user = crud.update_user(user_id, user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    crud.delete_user(user_id)
    return {"detail": "User deleted"}

# --- Onboarding Endpoint ---
from pydantic import BaseModel

class OnboardData(BaseModel):
    checking: float
    savings: float
    income: float

@app.post("/users/{user_id}/onboard")
def onboard_user(user_id: int, data: OnboardData):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_date = datetime.now()
    
    # Insert 'Checking Balance' as an income transaction
    if data.checking > 0:
        tx_checking = models.TransactionCreate(
            user_id=user_id,
            amount=data.checking,
            type="income",
            category="Income",
            date=current_date.strftime("%Y-%m-%d"),
            recipient="Checking Account"
        )
        crud.create_transaction(tx_checking)
        
    # Insert 'Savings Balance' as an income transaction
    if data.savings > 0:
        tx_savings = models.TransactionCreate(
            user_id=user_id,
            amount=data.savings,
            type="income",
            category="Income",
            date=current_date.strftime("%Y-%m-%d"),
            recipient="Savings Account"
        )
        crud.create_transaction(tx_savings)

    # Note: data.income is kept on the client side for AI context, we don't insert a fake transaction for it.
    
    all_transactions = crud.get_all_transactions(user_id)
    month_update(user_id, all_transactions)
    organize_assets(user_id, all_transactions)
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("transactions_changed", user_id)

    return {"detail": "Onboarding complete"}

# User Asset endpoints

@app.get("/budgets/{user_id}", response_model=List[models.Budget])
def read_budgets(user_id: int):
    # Optional logic: could check if user exists first
    return crud.get_budgets(user_id)

@app.put("/budgets/{user_id}")
def update_budget(user_id: int, budget: models.BudgetCreate):
    if budget.user_id != user_id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    crud.set_budget(budget)
    sse_bus.emit_event("budgets_changed", user_id)
    return {"detail": "Budget updated successfully"}

@app.get("/user_asset/{user_id}", response_model=models.UserAssetWithUser)
def get_user_asset(user_id: int):
    CurrentDate = datetime.now()
    db_user_asset = crud.get_user_asset(user_id, CurrentDate.year, CurrentDate.month)
    user = crud.get_user(user_id)
    if CurrentDate.month == 1:
        previous_user_asset = crud.get_user_asset(user_id, CurrentDate.year - 1, 12)
    else:
        previous_user_asset = crud.get_user_asset(user_id, CurrentDate.year, CurrentDate.month - 1)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user_asset is None:
        raise HTTPException(status_code=404, detail="User asset not found")
    return models.UserAssetWithUser(asset=db_user_asset, previous_asset=previous_user_asset, user=user)

@app.get("/user_assets/{user_id}/all", response_model=List[models.UserAsset])
def get_user_asset_history(user_id: int):
    return crud.get_all_user_assets(user_id)
@app.get("/user_assets/{user_id}/category", response_model=List[models.AssetCategory])
def get_category_summary(user_id: int):
    return crud.get_assets_by_all_category(user_id)

# Transaction endpoints
@app.post("/transactions/")
def create_transaction(transaction: models.TransactionCreate):
    # Validate linked debt (if any) before creating the transaction
    if transaction.debt_id is not None:
        debt = crud.get_debt(transaction.debt_id)
        if debt is None:
            raise HTTPException(status_code=404, detail="Debt not found")
        # Ensure the debt belongs to the same user as the transaction
        if getattr(debt, "user_id", None) != transaction.user_id:
            raise HTTPException(status_code=400, detail="Debt does not belong to user")

    crud.create_transaction(transaction)

    if transaction.debt_id is not None:
        sse_bus.emit_event("debts_changed", transaction.user_id)
        
    all_transactions = crud.get_all_transactions(transaction.user_id)
    month_update(transaction.user_id, all_transactions)
    organize_assets(transaction.user_id, all_transactions)
    update_networth(transaction.user_id, transactions=all_transactions)
    sse_bus.emit_event("transactions_changed", transaction.user_id)
    return {"detail": "Transaction created successfully"}


@app.get("/transactions/", response_model=list[models.Transaction])
def get_all_transactions(user_id: int = 1):
    transactions = crud.get_all_transactions(user_id)
    month_update(user_id, transactions)
    
    return transactions

@app.get("/transactions/{transaction_id}", response_model=models.Transaction)
def read_transaction(transaction_id: int):
    db_transaction = crud.get_transaction(transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@app.put("/transactions/{transaction_id}", response_model=models.Transaction)
def update_transaction_endpoint(
    transaction_id: int, 
    updated: models.TransactionUpdate, 
    apply_category_rule: bool = False, 
    apply_debt_rule: bool = False
):
    transaction = crud.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    if updated.debt_id is not None:
        debt = crud.get_debt(updated.debt_id)
        if debt is None:
            raise HTTPException(status_code=404, detail="Debt not found")
        if getattr(debt, "user_id", None) != transaction.user_id:
            raise HTTPException(status_code=400, detail="Debt does not belong to user")
            
    res = crud.update_transaction(transaction_id, updated, apply_category_rule, apply_debt_rule)
    if not res:
        raise HTTPException(status_code=500, detail="Failed to update transaction")
        
    user_id = transaction.user_id
    user_txns = crud.get_all_transactions(user_id)
    
    update_networth(user_id, transactions=user_txns)
    month_update(user_id, user_txns)
    organize_assets(user_id, user_txns)
    
    sse_bus.emit_event("transactions_changed", user_id)
    if transaction.debt_id is not None or updated.debt_id is not None:
        sse_bus.emit_event("debts_changed", user_id)
        
    return res

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):
    transaction = crud.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    user_id = transaction.user_id

    crud.delete_transaction(transaction_id)
    
    if transaction.debt_id is not None:
        sse_bus.emit_event("debts_changed", user_id)
    
    user_transactions = crud.get_all_transactions(user_id)
    
    update_networth(user_id, transactions=user_transactions)
    month_update(user_id, user_transactions)
    organize_assets(user_id, user_transactions)
    sse_bus.emit_event("transactions_changed", user_id)
    
    return {"detail": "Transaction deleted"}

@app.get("/stats/sankey/{user_id}")
def get_sankey_data(user_id: int, year: Optional[int] = None, month: Optional[int] = None):
    current_date = datetime.now()
    target_year = year if year is not None else current_date.year
    target_month = month if month is not None else current_date.month
    
    # Fetch transactions filtered at the SQL level by month/year
    filtered_txns = crud.get_transactions_by_month(user_id, target_year, target_month)

    # Get previous month's savings from user_assets
    if target_month == 1:
        prev_year, prev_month = target_year - 1, 12
    else:
        prev_year, prev_month = target_year, target_month - 1
    
    prev_asset = crud.get_user_asset(user_id, prev_year, prev_month)
    prev_savings = prev_asset.TSavings if prev_asset and prev_asset.TSavings > 0 else 0

    income_total = sum(t.amount for t in filtered_txns if t.type == "income")

    # If there's nothing at all, return empty
    if not filtered_txns and prev_savings <= 0:
        return {"nodes": [], "links": []}

    # Expenses by category
    expense_categories = defaultdict(float)
    for t in filtered_txns:
        if t.type == "expense":
            expense_categories[t.category] += t.amount

    total_expenses = sum(expense_categories.values())
    budget_total = income_total + prev_savings
    savings = budget_total - total_expenses

    # --- Build Nodes & Links ---
    nodes = []
    links = []

    # Column 1: Sources
    if income_total > 0:
        nodes.append({"id": "Income", "name": "Income", "fill": "#2dd4bf"})
        links.append({"from": "Income", "to": "Budget", "value": income_total})

    if prev_savings > 0:
        nodes.append({"id": "Prev. Savings", "name": "Prev. Savings", "fill": "#6366f1"})
        links.append({"from": "Prev. Savings", "to": "Budget", "value": prev_savings})

    # Column 2: Central pool
    nodes.append({"id": "Budget", "name": "Budget", "fill": "#3b82f6"})

    # Column 3: Destinations
    for category, amount in expense_categories.items():
        nodes.append({"id": category, "name": category, "fill": "#f43f5e"})
        links.append({"from": "Budget", "to": category, "value": amount})

    if savings > 0:
        nodes.append({"id": "Savings", "name": "Savings", "fill": "#22c55e"})
        links.append({"from": "Budget", "to": "Savings", "value": savings})

    return {"nodes": nodes, "links": links}

@app.get("/stats/history/{user_id}")
def get_stats_history(user_id: int):
    """Returns monthly financial summary for up to the last 12 months."""
    assets = crud.get_all_user_assets(user_id)
    if not assets:
        return []
    
    # Sort by year then month
    sorted_assets = sorted(assets, key=lambda a: (a.year, a.month))
    
    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    result = []
    for a in sorted_assets[-12:]:
        savings_rate = (a.TSavings / a.TIncome * 100) if a.TIncome > 0 else 0
        result.append({
            "month": month_names[a.month],
            "year": a.year,
            "income": a.TIncome,
            "expense": a.TExpense,
            "savings": a.TSavings,
            "net_worth": a.net_worth,
            "savings_rate": round(savings_rate, 1),
        })
    
    return result

@app.get("/stats/categories/{user_id}")
def get_stats_categories(user_id: int, year: Optional[int] = None, month: Optional[int] = None):
    """Returns expense breakdown by category for a specific month."""
    current_date = datetime.now()
    target_year = year if year is not None else current_date.year
    target_month = month if month is not None else current_date.month
    
    txns = crud.get_transactions_by_month(user_id, target_year, target_month)
    
    categories = defaultdict(float)
    for t in txns:
        if t.type == "expense":
            categories[t.category] += t.amount
    
    total = sum(categories.values())
    result = []
    for cat, amount in categories.items():
        pct = (amount / total * 100) if total > 0 else 0
        result.append({
            "category": cat,
            "amount": round(amount, 2),
            "percentage": round(pct, 1),
            "fill": "#f43f5e",  # default, frontend can override
        })
    
    # Sort by amount descending
    result.sort(key=lambda x: x["amount"], reverse=True)
    return result

# --- Recurring Transactions Endpoints ---

@app.post("/recurring_transactions/")
def create_recurring(rt: models.RecurringTransactionCreate):
    print(f"DEBUG: Received Recurring tx. Start Date: {rt.start_date}, Type: {type(rt.start_date)}")
    crud.create_recurring_transaction(rt)
    sse_bus.emit_event("recurring_changed", rt.user_id)
    return {"detail": "Recurring transaction created"}

@app.get("/recurring_transactions/{user_id}", response_model=List[models.RecurringTransaction])
def get_recurring(user_id: int):
    return crud.get_all_recurring_transactions(user_id)

@app.put("/recurring_transactions/{rt_id}")
def update_recurring(rt_id: int, rt: models.RecurringTransactionCreate):
    crud.update_recurring_transaction(rt_id, rt)
    sse_bus.emit_event("recurring_changed", rt.user_id)
    return {"detail": "Recurring transaction updated"}

@app.delete("/recurring_transactions/{rt_id}")
def delete_recurring(rt_id: int):
    existing = crud.get_recurring_transaction(rt_id)
    user_id = existing.user_id if existing else 1
    crud.delete_recurring_transaction(rt_id)
    sse_bus.emit_event("recurring_changed", user_id)
    return {"detail": "Recurring transaction deleted"}

@app.get("/stats/category-history/{user_id}")
def get_category_history(user_id: int, categories: str = "Housing,Food,Transport"):
    """Returns monthly expense totals for specific categories over last 12 months."""
    target_cats = [c.strip() for c in categories.split(",")]
    assets = crud.get_all_user_assets(user_id)
    if not assets:
        return []
    
    sorted_assets = sorted(assets, key=lambda a: (a.year, a.month))
    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    result = []
    for a in sorted_assets[-12:]:
        txns = crud.get_transactions_by_month(user_id, a.year, a.month)
        entry = {
            "month": month_names[a.month],
            "year": a.year,
            "label": f"{month_names[a.month]} {a.year}",
        }
        for cat in target_cats:
            entry[cat] = sum(t.amount for t in txns if t.type == "expense" and t.category == cat)
        result.append(entry)
    
    return result

@app.get("/stats/daily-spending/{user_id}")
def get_daily_spending(user_id: int, year: Optional[int] = None, month: Optional[int] = None):
    """Returns daily expense totals for heatmap visualization."""
    current_date = datetime.now()
    target_year = year if year is not None else current_date.year
    target_month = month if month is not None else current_date.month
    
    txns = crud.get_transactions_by_month(user_id, target_year, target_month)
    
    daily = defaultdict(float)
    for t in txns:
        if t.type == "expense":
            day = t.date.day if hasattr(t.date, 'day') else int(str(t.date).split('-')[2])
            daily[day] += t.amount
    
    # Build full month calendar
    import calendar
    days_in_month = calendar.monthrange(target_year, target_month)[1]
    result = []
    for d in range(1, days_in_month + 1):
        result.append({
            "day": d,
            "amount": round(daily.get(d, 0), 2),
            "weekday": calendar.weekday(target_year, target_month, d),  # 0=Mon, 6=Sun
        })
    
    return result


# Non endpoint functions

def update_networth(user_id: int, transaction: Optional[models.TransactionCreate] = None, transactions: Optional[List[models.TransactionCreate]] = None):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    total_debt = crud.get_total_debt_balance(user_id)
    total_assets = crud.get_total_tracked_assets_value(user_id)
    
    plaid_accounts = crud.get_plaid_accounts(user_id)
    if plaid_accounts:
        plaid_assets = 0.0
        plaid_liabilities = 0.0
        for acct in plaid_accounts:
            acct_type = acct['type']
            bal = acct['balance_current'] or 0.0
            if acct_type in ['depository', 'investment', 'brokerage']:
                plaid_assets += bal
            elif acct_type in ['credit', 'loan']:
                plaid_liabilities += bal
            else:
                print(f"Warning: Unrecognized Plaid account type '{acct_type}' for balance {bal}. Treating as liability.", file=sys.stderr)
                plaid_liabilities += bal
                
        all_txs = transactions if transactions is not None else crud.get_all_transactions(user_id)
        manual_net = 0.0
        for tx in all_txs:
            if tx.user_id == user_id and not tx.plaid_transaction_id:
                if tx.type == "income":
                    manual_net += tx.amount
                elif tx.type == "expense":
                    manual_net -= tx.amount
                    
        user.net_worth = (plaid_assets - plaid_liabilities) + manual_net + total_assets - total_debt
    else:
        if transaction:
            if transaction.type == "income":
                user.net_worth += transaction.amount
            elif transaction.type == "expense":
                user.net_worth -= transaction.amount
        else:
            raw = 0.0
            all_txs = transactions if transactions is not None else crud.get_all_transactions(user_id)
            for tx in all_txs:
                if tx.user_id == user_id:
                    if tx.type == "income":
                        raw += tx.amount
                    elif tx.type == "expense":
                        raw -= tx.amount
            user.net_worth = (raw + total_assets) - total_debt

    crud.update_user(user_id, user)

def month_update(user_id: int, transactions: list[models.TransactionCreate]):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    CURR_DATE = datetime.now()

    curr_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month)
    last_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month - 1) if CURR_DATE.month > 1 else crud.get_user_asset(user_id, CURR_DATE.year - 1, 12)

    total_income = 0.0
    total_expense = 0.0
    overflow = 0.0
    if last_asset is not None: 
        overflow = last_asset.TSavings
    curr_net_worth = user.net_worth

    if curr_asset is None:
        user_asset_obj = models.UserAsset(
            user_id=user_id,
            year=CURR_DATE.year,
            month=CURR_DATE.month,
            TIncome=total_income,
            TExpense=total_expense,
            TSavings=total_income - total_expense,
            net_worth=curr_net_worth
        )
        crud.create_user_asset(user_asset_obj)
        
    for transaction in transactions:
        if transaction.date.month == CURR_DATE.month and transaction.date.year == CURR_DATE.year:
            if transaction.type == "income":
                total_income += transaction.amount
            elif transaction.type == "expense":
                total_expense += transaction.amount
    total_income += overflow
    total_savings = total_income - total_expense 
    user_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month)
    if user_asset is None:
        raise HTTPException(status_code=404, detail="User asset not found")
    user_asset_obj = models.UserAsset(
        id=user_asset.id,
        user_id=user_id,
        year=CURR_DATE.year,
        month=CURR_DATE.month,
        TIncome=total_income,
        TExpense=total_expense,
        TSavings=total_savings,
        net_worth=curr_net_worth
    )
    crud.update_user_asset(user_asset_obj)

def organize_assets(user_id: int, transactions: list[models.TransactionCreate]):
    """
    Organizes assets for the user based on transactions.
    This function can be expanded to include more complex asset management logic.
    """
    assets = crud.get_all_user_assets(user_id)
    assets_sorted = sorted(assets, key=lambda a: (a.year, a.month))

    for i, asset in enumerate(assets_sorted):
        # Reset totals for the current asset
        TotalIncome = 0
        TotalExpense = 0
        TotalSavings = 0
        OverFlow = 0
        # Grab the overflow from the previous asset if it exists
        if i > 0:
            OverFlow = assets_sorted[i - 1].TSavings

        # Filter transactions for the current asset's month and year
        monTransactions = [t for t in transactions if t.date.month == asset.month and t.date.year == asset.year]

        # Calculate totals even if there are no transactions (important for deletes)
        for transaction in monTransactions:
            if transaction.type == "income":
                TotalIncome += transaction.amount
            elif transaction.type == "expense":
                TotalExpense += transaction.amount
        TotalIncome += OverFlow
        TotalSavings = TotalIncome - TotalExpense
        

        # Update the asset with the new totals if they actually changed
        if (asset.TIncome != TotalIncome or 
            asset.TExpense != TotalExpense or 
            asset.TSavings != TotalSavings or 
            asset.net_worth != TotalSavings):
            
            asset.TIncome = TotalIncome
            asset.TExpense = TotalExpense
            asset.TSavings = TotalSavings
            asset.net_worth = TotalSavings
            # Commit the changes to the database
            crud.update_user_asset(asset)

    # Create new assets for transactions that lie outside the current asset's month

    # Build a set of (year, month) tuples from assets
    asset_months = {(a.year, a.month) for a in assets}

    # Filter transactions whose (year, month) is not in assets
    excess = [t for t in transactions if (t.date.year, t.date.month) not in asset_months]

    # Organize excess by (year, month)
    excess_by_month = defaultdict(list)
    for t in excess:
        excess_by_month[(t.date.year, t.date.month)].append(t)

    # Now you can easily iterate:
    for (year, month), txns in excess_by_month.items():
        TotalIncome = sum(t.amount for t in txns if t.type == "income")
        TotalExpense = sum(t.amount for t in txns if t.type == "expense")
        TotalSavings = TotalIncome - TotalExpense

        asset = models.UserAsset(
            user_id=user_id,
            year=year,
            month=month,
            TIncome=TotalIncome,
            TExpense=TotalExpense,
            TSavings=TotalSavings,
            net_worth=TotalSavings  # Adjust net worth based on savings
        )

        crud.create_user_asset(asset)

# --- Debt Endpoints ---

@app.get("/debts/{user_id}", response_model=List[models.Debt])
def get_debts(user_id: int, type: Optional[str] = None):
    if type:
        return crud.get_debts_by_type(user_id, type)
    return crud.get_debts(user_id)

@app.post("/debts/{user_id}", response_model=models.Debt)
def create_debt(user_id: int, debt: models.DebtCreate):
    if debt.user_id != user_id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    created = crud.create_debt(debt)
    
    # Auto-create recurring transaction for monthly payment
    if debt.monthly_payment > 0:
        # Avoid circular validation errors by parsing strings/dates safely
        start_dt = debt.start_date if debt.start_date else datetime.now().date()
        rt = models.RecurringTransactionCreate(
            user_id=user_id,
            recipient=debt.name,
            amount=debt.monthly_payment,
            category=models.TransactionCategory.Bills,
            type=models.TransactionType.expense,
            interval=models.RecurringInterval.monthly,
            start_date=start_dt
        )
        crud.create_recurring_transaction(rt)
        sse_bus.emit_event("recurring_changed", user_id)

    # New debt immediately reduces net worth
    all_transactions = crud.get_all_transactions(user_id)
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", user_id)
    return created

@app.put("/debts/{debt_id}", response_model=models.Debt)
def update_debt(debt_id: int, debt: models.DebtCreate):
    existing = crud.get_debt(debt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Debt not found")
    updated = crud.update_debt(debt_id, debt)
    all_transactions = crud.get_all_transactions(existing.user_id)
    update_networth(existing.user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", existing.user_id)
    return updated

@app.patch("/debts/{debt_id}/balance")
def patch_debt_balance(debt_id: int, body: models.BalanceUpdate):
    existing = crud.get_debt(debt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Debt not found")
    crud.update_debt_balance(debt_id, body.balance)
    all_transactions = crud.get_all_transactions(existing.user_id)
    update_networth(existing.user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", existing.user_id)
    return {"detail": "Balance updated"}

@app.delete("/debts/{debt_id}")
def delete_debt(debt_id: int):
    existing = crud.get_debt(debt_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Debt not found")
    crud.delete_debt(debt_id)
    all_transactions = crud.get_all_transactions(existing.user_id)
    update_networth(existing.user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", existing.user_id)
    return {"detail": "Debt deleted"}

# --- Notifications Endpoints ---


@app.get("/notifications/{user_id}", response_model=List[models.Notification])
def get_notifications(user_id: int):
    return crud.get_user_notifications(user_id)

@app.put("/notifications/{notification_id}/read")
def read_notification(notification_id: int):
    notif = crud.get_notification(notification_id)
    user_id = notif.user_id if notif else 1
    crud.mark_notification_read(notification_id)
    sse_bus.emit_event("notifications_changed", user_id)
    return {"detail": "Notification marked read"}

@app.put("/notifications/user/{user_id}/read_all")
def read_all_notifications(user_id: int):
    crud.mark_all_notifications_read(user_id)
    sse_bus.emit_event("notifications_changed", user_id)
    return {"detail": "All notifications marked read"}

@app.delete("/notifications/{notification_id}")
def delete_notification(notification_id: int):
    notif = crud.get_notification(notification_id)
    user_id = notif.user_id if notif else 1
    crud.delete_notification(notification_id)
    sse_bus.emit_event("notifications_changed", user_id)
    return {"detail": "Notification deleted"}

# --- Plaid Integration & Key Management ---

import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest

def get_plaid_client():
    client_id = crud.get_system_setting("plaid_client_id") or os.environ.get("PLAID_CLIENT_ID")
    secret = crud.get_system_setting("plaid_secret") or os.environ.get("PLAID_SECRET")
    env = crud.get_system_setting("plaid_env") or os.environ.get("PLAID_ENV") or "sandbox"
    
    if not client_id or not secret:
        return None
        
    if env == "sandbox":
        host = plaid.Environment.Sandbox
    elif env == "development":
        host = plaid.Environment.Development
    elif env == "production":
        host = plaid.Environment.Production
    else:
        host = plaid.Environment.Sandbox
        
    configuration = plaid.Configuration(
        host=host,
        api_key={
            'clientId': client_id,
            'secret': secret
        }
    )
    api_client = plaid.ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

def sync_transactions_for_item(user_id: int, client, access_token: str, db_item_id: int) -> int:
    cursor = ""
    has_more = True
    added_count = 0
    
    while has_more:
        sync_request = TransactionsSyncRequest(
            access_token=access_token,
            cursor=cursor,
            count=100
        )
        response = client.transactions_sync(sync_request)
        
        transactions_to_add = []
        for tx in response.get('added', []):
            tx_date_raw = tx['date']
            if isinstance(tx_date_raw, str):
                tx_date = datetime.strptime(tx_date_raw, "%Y-%m-%d").date()
            elif hasattr(tx_date_raw, 'date'):
                tx_date = tx_date_raw.date()
            else:
                tx_date = tx_date_raw
                
            cutoff = datetime.now().date() - timedelta(days=365)
            if tx_date < cutoff:
                continue # Skip transactions older than 365 days
                
            plaid_amt = float(tx['amount'])
            if plaid_amt >= 0:
                tx_type = "expense"
                amount = plaid_amt
            else:
                tx_type = "income"
                amount = -plaid_amt
                
            category_list = tx.get('category', [])
            plaid_cat = category_list[0] if category_list else "Other"
            
            # Simple normalization to match sAIve defaults
            mapped_cat = plaid_cat
            plaid_cat_lower = plaid_cat.lower()
            if any(k in plaid_cat_lower for k in ["food", "restaurant", "dining", "groceries", "supermarket"]):
                mapped_cat = "Food"
            elif any(k in plaid_cat_lower for k in ["travel", "taxi", "gas", "transit", "parking", "automotive", "transportation"]):
                mapped_cat = "Transportation"
            elif any(k in plaid_cat_lower for k in ["bill", "utilities", "insurance", "healthcare", "medical", "pharmacy", "services"]):
                mapped_cat = "Bills"
            elif "subscription" in plaid_cat_lower:
                mapped_cat = "Subscriptions"
            elif any(k in plaid_cat_lower for k in ["rent", "mortgage", "housing"]):
                mapped_cat = "Housing"
            elif any(k in plaid_cat_lower for k in ["income", "payroll", "salary", "wage"]) or ("transfer" in plaid_cat_lower and tx_type == "income"):
                mapped_cat = "Income"
            
            recipient = tx.get('merchant_name') or tx.get('name') or "Unknown Merchant"
            
            new_tx = models.TransactionCreate(
                user_id=user_id,
                recipient=sanitize(recipient),
                date=tx_date.strftime("%Y-%m-%d") if hasattr(tx_date, 'strftime') else str(tx_date),
                amount=amount,
                category=mapped_cat,
                type=tx_type,
                plaid_transaction_id=tx['transaction_id'],
                plaid_account_id=tx['account_id']
            )
            transactions_to_add.append(new_tx)
            
        if transactions_to_add:
            added_count += crud.create_transactions_batch(transactions_to_add)
                
        cursor = response['next_cursor']
        has_more = response['has_more']
        
    return added_count

@app.post("/plaid/config")
def save_plaid_config(config: models.PlaidConfig):
    crud.save_system_setting("plaid_client_id", config.client_id)
    crud.save_system_setting("plaid_secret", config.secret)
    crud.save_system_setting("plaid_env", config.env)
    return {"status": "success", "message": "Plaid configurations updated successfully."}

@app.get("/plaid/config")
def check_plaid_config():
    client_id = crud.get_system_setting("plaid_client_id") or os.environ.get("PLAID_CLIENT_ID")
    secret = crud.get_system_setting("plaid_secret") or os.environ.get("PLAID_SECRET")
    env = crud.get_system_setting("plaid_env") or os.environ.get("PLAID_ENV") or "sandbox"
    return {
        "is_configured": bool(client_id and secret),
        "env": env
    }

@app.post("/plaid/create_link_token")
def create_link_token(user_id: int = 1):
    client = get_plaid_client()
    if not client:
        raise HTTPException(status_code=400, detail="Plaid is not configured.")
        
    try:
        request = LinkTokenCreateRequest(
            products=[Products('transactions')],
            client_name="sAIve Client",
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(user_id)
            )
        )
        response = client.link_token_create(request)
        return {"link_token": response['link_token']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create link token: {str(e)}")

@app.post("/plaid/exchange_public_token")
def exchange_public_token(payload: models.PlaidExchangeToken, user_id: int = 1):
    client = get_plaid_client()
    if not client:
        raise HTTPException(status_code=400, detail="Plaid client is unconfigured.")
        
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=payload.public_token
        )
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        
        # Try to get institution details
        item_request = plaid.model.item_get_request.ItemGetRequest(access_token=access_token)
        item_response = client.item_get(item_request)
        institution_id = item_response['item']['institution_id']
        
        institution_name = "Linked Institution"
        if institution_id:
            try:
                inst_request = plaid.model.institutions_get_by_id_request.InstitutionsGetByIdRequest(
                    institution_id=institution_id,
                    country_codes=[CountryCode('US')]
                )
                inst_response = client.institutions_get_by_id(inst_request)
                institution_name = inst_response['institution']['name']
            except Exception:
                pass
                
        db_item_id = crud.create_plaid_item(user_id, access_token, item_id, institution_name)
        
        # Fetch accounts
        accounts_request = plaid.model.accounts_get_request.AccountsGetRequest(access_token=access_token)
        accounts_response = client.accounts_get(accounts_request)
        
        for account in accounts_response['accounts']:
            balances = account.get('balances', {})
            crud.upsert_plaid_account(
                plaid_item_id=db_item_id,
                account_id=account['account_id'],
                name=account['name'],
                mask=account.get('mask'),
                acct_type=str(account['type']),
                subtype=str(account.get('subtype')),
                balance_available=balances.get('available'),
                balance_current=balances.get('current'),
                balance_limit=balances.get('limit')
            )
            
        # 60 day initial transaction sync
        sync_transactions_for_item(user_id, client, access_token, db_item_id)
        
        # Calculate states
        user_txns = crud.get_all_transactions(user_id)
        update_networth(user_id, transactions=user_txns)
        month_update(user_id, user_txns)
        organize_assets(user_id, user_txns)
        
        sse_bus.emit_event("transactions_changed", user_id)
        return {"status": "success", "institution_name": institution_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to exchange public token: {str(e)}")

LAST_PLAID_SYNC = {}
PLAID_SYNC_COOLDOWN = 30  # 30 seconds cooldown

@app.post("/plaid/sync")
def sync_plaid_transactions_endpoint(user_id: int = 1):
    import time
    now = time.time()
    last_sync = LAST_PLAID_SYNC.get(user_id, 0)
    if now - last_sync < PLAID_SYNC_COOLDOWN:
        raise HTTPException(
            status_code=429, 
            detail=f"Plaid sync is rate-limited. Please wait {int(PLAID_SYNC_COOLDOWN - (now - last_sync))} seconds before syncing again."
        )
    LAST_PLAID_SYNC[user_id] = now

    client = get_plaid_client()
    if not client:
        raise HTTPException(status_code=400, detail="Plaid client is unconfigured.")
        
    items = crud.get_plaid_items(user_id)
    if not items:
        return {"status": "success", "synced_items": 0, "transactions_added": 0}
        
    total_added = 0
    for item in items:
        try:
            added = sync_transactions_for_item(user_id, client, item['access_token'], item['id'])
            total_added += added
            
            # Sync balances
            accounts_request = plaid.model.accounts_get_request.AccountsGetRequest(access_token=item['access_token'])
            accounts_response = client.accounts_get(accounts_request)
            for account in accounts_response['accounts']:
                balances = account.get('balances', {})
                crud.upsert_plaid_account(
                    plaid_item_id=item['id'],
                    account_id=account['account_id'],
                    name=account['name'],
                    mask=account.get('mask'),
                    acct_type=str(account['type']),
                    subtype=str(account.get('subtype')),
                    balance_available=balances.get('available'),
                    balance_current=balances.get('current'),
                    balance_limit=balances.get('limit')
                )
        except Exception as e:
            crud.update_plaid_item_status(item['item_id'], 'error')
            print(f"Error syncing Plaid item {item['item_id']}: {e}")
            
    if total_added > 0:
        user_txns = crud.get_all_transactions(user_id)
        update_networth(user_id, transactions=user_txns)
        month_update(user_id, user_txns)
        organize_assets(user_id, user_txns)
        
    sse_bus.emit_event("transactions_changed", user_id)
    return {"status": "success", "synced_items": len(items), "transactions_added": total_added}

@app.get("/plaid/accounts")
def get_plaid_accounts_endpoint(user_id: int = 1):
    rows = crud.get_plaid_accounts(user_id)
    return [
        {
            "id": r["id"],
            "account_id": r["account_id"],
            "name": r["name"],
            "mask": r["mask"],
            "type": r["type"],
            "subtype": r["subtype"],
            "balance_available": r["balance_available"],
            "balance_current": r["balance_current"],
            "balance_limit": r["balance_limit"],
            "institution_name": r["institution_name"],
            "item_id": r["item_id"]
        }
        for r in rows
    ]

@app.delete("/plaid/item/{item_id}")
def delete_plaid_item_endpoint(item_id: str, user_id: int = 1):
    crud.delete_plaid_item(user_id, item_id)
    
    # Recalculate states
    all_transactions = crud.get_all_transactions()
    user_txns = [t for t in all_transactions if t.user_id == user_id]
    update_networth(user_id, transactions=user_txns)
    month_update(user_id, user_txns)
    organize_assets(user_id, user_txns)
    
    sse_bus.emit_event("transactions_changed", user_id)
    return {"status": "success", "message": f"Bank connection {item_id} successfully removed."}

# --- Dynamic Category Management ---

@app.get("/categories")
def get_categories_endpoint():
    return crud.get_categories()

@app.post("/categories")
def create_category_endpoint(category: models.CategoryCreate):
    crud.create_category(category.name, category.color or 'muted')
    return {"status": "success", "message": f"Category {category.name} created."}

@app.delete("/categories/{name}")
def delete_category_endpoint(name: str):
    crud.delete_category(name)
    return {"status": "success", "message": f"Category {name} deleted."}

# --- MCP Server Integration ---
from mcp.server.fastmcp import FastMCP

mcp_server = FastMCP("sAIve", streamable_http_path="/")

@mcp_server.tool()
def get_net_worth(user_id: int) -> float:
    """Get the current net worth of a user."""
    user = crud.get_user(user_id)
    if not user:
        return 0.0
    return user.net_worth

@mcp_server.tool()
def log_transaction(user_id: int, amount: float, tx_type: str, category: str, recipient: str, date: Optional[str] = None) -> str:
    """Log a new financial transaction for the user, updating their net worth. 
    tx_type must be 'income' or 'expense'.
    category must be one of: 'Housing', 'Food', 'Transportation', 'Subscriptions', 'Bills', 'Income', 'Other'.
    date should be in 'YYYY-MM-DD' format. If not provided, defaults to today.
    """
    if date:
        try:
            # Validate format
            datetime.strptime(date, "%Y-%m-%d")
            tx_date = date
        except ValueError:
            return "Error: date must be in YYYY-MM-DD format."
    else:
        tx_date = datetime.now().strftime("%Y-%m-%d")

    try:
        tx = models.TransactionCreate(
            user_id=user_id,
            amount=amount,
            type=tx_type,
            category=category,
            date=tx_date,
            recipient=sanitize(recipient)
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
    crud.create_transaction(tx)
    all_transactions = crud.get_all_transactions(user_id)
    update_networth(user_id, transactions=all_transactions)
    month_update(user_id, all_transactions)
    organize_assets(user_id, all_transactions)
    sse_bus.emit_event("transactions_changed", user_id)
    return f"Successfully logged {tx_type} of {amount} to {recipient} on {tx_date}."

@mcp_server.tool()
def batch_log_transactions(user_id: int, transactions: list[dict]) -> str:
    """
    Log multiple transactions rapidly.
    'transactions' should be a list of dicts, each containing:
    - amount: float
    - tx_type: str ('income' or 'expense')
    - category: str (must be 'Housing', 'Food', 'Transportation', 'Subscriptions', 'Bills', 'Income', or 'Other')
    - recipient: str
    - date: str (optional, 'YYYY-MM-DD')
    """
    success_count = 0
    errors = []
    
    for i, t in enumerate(transactions):
        try:
            date_str = t.get('date')
            if date_str:
                datetime.strptime(date_str, "%Y-%m-%d")
            else:
                date_str = datetime.now().strftime("%Y-%m-%d")

            tx = models.TransactionCreate(
                user_id=user_id,
                amount=float(t['amount']),
                type=t['tx_type'],
                category=t['category'],
                date=date_str,
                recipient=sanitize(t['recipient'])
            )
            crud.create_transaction(tx)
            success_count += 1
        except Exception as e:
            errors.append(f"Row {i} failed: {str(e)}")
            
    # Calculate globally once at the end of the batch
    if success_count > 0:
        all_transactions = crud.get_all_transactions(user_id)
        update_networth(user_id, transactions=all_transactions)
        month_update(user_id, all_transactions)
        organize_assets(user_id, all_transactions)
        sse_bus.emit_event("transactions_changed", user_id)
        
    result = f"Successfully logged {success_count} transactions."
    if errors:
        result += f" Encountered {len(errors)} errors: " + " | ".join(errors)
        
    return result

@mcp_server.tool()
def get_expense_categories(user_id: int, year: int, month: int) -> dict:
    """Returns a breakdown of expense categories for a specific month and year."""
    txns = crud.get_transactions_by_month(user_id, year, month)
    categories = defaultdict(float)
    for t in txns:
        if t.type == "expense":
            categories[t.category] += t.amount
    return dict(categories)

@mcp_server.tool()
def update_budget(user_id: int, category: str, amount: float) -> str:
    """Update or set the budget limit for a specific category.
    category must be one of: 'Housing', 'Food', 'Transportation', 'Subscriptions', 'Bills', 'Income', 'Other'.
    """
    bg = models.BudgetCreate(
        user_id=user_id,
        category=category,
        amount=amount
    )
    crud.set_budget(bg)
    sse_bus.emit_event("budgets_changed", user_id)
    return f"Successfully updated budget for {category} to {amount}."

@mcp_server.tool()
def get_user_info(user_id: int) -> dict:
    """Get the name and net worth of a user."""
    user = crud.get_user(user_id)
    if not user:
        return {"error": f"User {user_id} not found."}
    return {"id": user.id, "name": user.name, "net_worth": user.net_worth}

@mcp_server.tool()
def get_transactions(user_id: int, year: int, month: int) -> list:
    """Get all transactions for a user in a specific month and year.
    Returns a list of transaction dicts with id, date, amount, type, category, and recipient.
    """
    txns = crud.get_transactions_by_month(user_id, year, month)
    return [
        {
            "id": t.id,
            "date": str(t.date),
            "amount": t.amount,
            "type": t.type,
            "category": t.category,
            "recipient": t.recipient,
        }
        for t in txns
    ]

@mcp_server.tool()
def delete_transaction(transaction_id: int, user_id: int) -> str:
    """Delete a transaction by its ID and recalculate the user's financial state.
    Returns a confirmation message or an error string.
    """
    transaction = crud.get_transaction(transaction_id)
    if not transaction:
        return f"Error: Transaction {transaction_id} not found."
    if transaction.user_id != user_id:
        return f"Error: Transaction {transaction_id} does not belong to user {user_id}."
    crud.delete_transaction(transaction_id)
    user_transactions = crud.get_all_transactions(user_id)
    update_networth(user_id, transactions=user_transactions)
    month_update(user_id, user_transactions)
    organize_assets(user_id, user_transactions)
    sse_bus.emit_event("transactions_changed", user_id)
    return f"Successfully deleted transaction {transaction_id}."

@mcp_server.tool()
def get_budgets(user_id: int) -> list:
    """Get all budget limits set for a user.
    Returns a list of dicts with category and amount.
    """
    budgets = crud.get_budgets(user_id)
    return [{"id": b.id, "category": b.category, "amount": b.amount} for b in budgets]

@mcp_server.tool()
def get_monthly_summary(user_id: int, year: int, month: int) -> dict:
    """Get the monthly financial summary (income, expenses, savings, net worth) for a user.
    Returns a dict with keys: income, expense, savings, net_worth.
    Returns an empty dict if no data exists for that month.
    """
    asset = crud.get_user_asset(user_id, year, month)
    if not asset:
        return {}
    return {
        "year": asset.year,
        "month": asset.month,
        "income": asset.TIncome,
        "expense": asset.TExpense,
        "savings": asset.TSavings,
        "net_worth": asset.net_worth,
    }

@mcp_server.tool()
def get_financial_history(user_id: int) -> list:
    """Get the financial history for a user over the last 12 months.
    Returns a list of monthly summaries sorted oldest to newest, each with:
    month, year, income, expense, savings, net_worth, savings_rate (%).
    """
    assets = crud.get_all_user_assets(user_id)
    if not assets:
        return []
    sorted_assets = sorted(assets, key=lambda a: (a.year, a.month))
    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    result = []
    for a in sorted_assets[-12:]:
        savings_rate = (a.TSavings / a.TIncome * 100) if a.TIncome > 0 else 0
        result.append({
            "month": month_names[a.month],
            "year": a.year,
            "income": a.TIncome,
            "expense": a.TExpense,
            "savings": a.TSavings,
            "net_worth": a.net_worth,
            "savings_rate": round(savings_rate, 1),
        })
    return result

@mcp_server.tool()
def get_recurring_transactions(user_id: int) -> list:
    """Get all recurring transactions (subscriptions, bills, etc.) for a user.
    Returns a list of dicts with id, recipient, amount, type, category, interval, start_date, next_date.
    """
    rts = crud.get_all_recurring_transactions(user_id)
    return [
        {
            "id": rt.id,
            "recipient": rt.recipient,
            "amount": rt.amount,
            "type": rt.type,
            "category": rt.category,
            "interval": rt.interval,
            "start_date": str(rt.start_date),
            "next_date": str(rt.next_date),
        }
        for rt in rts
    ]

@mcp_server.tool()
def create_recurring_transaction(user_id: int, amount: float, tx_type: str, category: str, recipient: str, interval: str, start_date: str) -> str:
    """Create a new recurring transaction (e.g. a subscription or regular bill).
    tx_type must be 'income' or 'expense'.
    category must be one of: 'Housing', 'Food', 'Transportation', 'Subscriptions', 'Bills', 'Income', 'Other'.
    interval must be one of: 'daily', 'weekly', 'monthly', 'yearly'.
    start_date should be in 'YYYY-MM-DD' format.
    """
    try:
        datetime.strptime(start_date, "%Y-%m-%d")
    except ValueError:
        return "Error: start_date must be in YYYY-MM-DD format."
    try:
        rt = models.RecurringTransactionCreate(
            user_id=user_id,
            amount=amount,
            type=tx_type,
            category=category,
            recipient=sanitize(recipient),
            interval=interval,
            start_date=start_date,
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
    crud.create_recurring_transaction(rt)
    sse_bus.emit_event("recurring_changed", user_id)
    return f"Successfully created recurring {tx_type} of {amount} to {recipient} every {interval} starting {start_date}."

@mcp_server.tool()
def update_recurring_transaction(rt_id: int, user_id: int, amount: float, tx_type: str, category: str, recipient: str, interval: str, start_date: str) -> str:
    """Update an existing recurring transaction (e.g. change subscription amount or frequency).
    tx_type must be 'income' or 'expense'.
    category must be one of: 'Housing', 'Food', 'Transportation', 'Subscriptions', 'Bills', 'Income', 'Other'.
    interval must be one of: 'daily', 'weekly', 'monthly', 'yearly'.
    start_date should be in 'YYYY-MM-DD' format.
    """
    existing = crud.get_recurring_transaction(rt_id)
    if not existing:
        return f"Error: Recurring transaction {rt_id} not found."
    if existing.user_id != user_id:
        return f"Error: Recurring transaction {rt_id} does not belong to user {user_id}."
    try:
        datetime.strptime(start_date, "%Y-%m-%d")
    except ValueError:
        return "Error: start_date must be in YYYY-MM-DD format."
    try:
        rt = models.RecurringTransactionCreate(
            user_id=user_id,
            amount=amount,
            type=tx_type,
            category=category,
            recipient=sanitize(recipient),
            interval=interval,
            start_date=start_date,
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
    crud.update_recurring_transaction(rt_id, rt)
    sse_bus.emit_event("recurring_changed", user_id)
    return f"Successfully updated recurring transaction {rt_id}."

@mcp_server.tool()
def delete_recurring_transaction(rt_id: int, user_id: int) -> str:
    """Delete a recurring transaction (cancel a subscription or bill) by its ID."""
    existing = crud.get_recurring_transaction(rt_id)
    if not existing:
        return f"Error: Recurring transaction {rt_id} not found."
    if existing.user_id != user_id:
        return f"Error: Recurring transaction {rt_id} does not belong to user {user_id}."
    crud.delete_recurring_transaction(rt_id)
    sse_bus.emit_event("recurring_changed", user_id)
    return f"Successfully deleted recurring transaction {rt_id}."

@mcp_server.tool()
def get_notifications(user_id: int) -> list:
    """Get the latest notifications for a user (up to 50, newest first).
    Returns a list of dicts with id, title, message, date, is_read, and type.
    """
    notifications = crud.get_user_notifications(user_id)
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "date": str(n.date),
            "is_read": n.is_read,
            "type": n.type,
        }
        for n in notifications
    ]

@app.post("/tracked_assets/", response_model=models.TrackedAsset)
def create_tracked_asset(asset: models.TrackedAssetCreate):
    created = crud.create_tracked_asset(asset)
    
    # Recalculate net worth immediately incorporating the new equity
    all_transactions = crud.get_all_transactions(asset.user_id)
    update_networth(asset.user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", asset.user_id)
    sse_bus.emit_event("transactions_changed", asset.user_id) # Triggers front-end net-worth card refetch
    
    return created

@app.get("/tracked_assets/{user_id}", response_model=List[models.TrackedAsset])
def get_tracked_assets(user_id: int):
    return crud.get_tracked_assets(user_id)

@app.put("/tracked_assets/{asset_id}", response_model=models.TrackedAsset)
def update_tracked_asset(asset_id: int, asset: models.TrackedAssetCreate):
    existing = crud.get_tracked_asset(asset_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    updated = crud.update_tracked_asset(asset_id, asset)
    all_transactions = crud.get_all_transactions(asset.user_id)
    update_networth(asset.user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", asset.user_id)
    sse_bus.emit_event("transactions_changed", asset.user_id)
    
    return updated

@app.delete("/tracked_assets/{asset_id}")
def delete_tracked_asset(asset_id: int):
    existing = crud.get_tracked_asset(asset_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    user_id = existing.user_id
    crud.delete_tracked_asset(asset_id)
    all_transactions = crud.get_all_transactions(user_id)
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", user_id)
    sse_bus.emit_event("transactions_changed", user_id)
    
    return {"detail": "Asset deleted successfully"}

# --- FastAPI MCP Tools ---

@mcp_server.tool()
def get_debts(user_id: int, debt_type: Optional[str] = None) -> list:
    """Get all debts for a user.
    Optionally filter by debt_type (e.g. 'auto', 'credit_card', 'student', 'mortgage', 'personal').
    Returns a list of dicts representing the debts.
    """
    if debt_type:
        debts = crud.get_debts_by_type(user_id, debt_type)
    else:
        debts = crud.get_debts(user_id)
        
    return [
        {
            "id": d.id,
            "name": d.name,
            "type": d.type,
            "balance": d.balance,
            "total_amount": d.total_amount,
            "interest_rate": d.interest_rate,
            "monthly_payment": d.monthly_payment,
            "start_date": str(d.start_date) if d.start_date else None
        }
        for d in debts
    ]

@mcp_server.tool()
def get_credit_cards(user_id: int) -> list:
    """Convenience tool to get all credit card revolving debts for a user.
    Returns a list of dicts representing the user's credit card debts.
    """
    debts = crud.get_debts_by_type(user_id, "credit_card")
    return [
        {
            "id": d.id,
            "name": d.name,
            "balance": d.balance,
            "total_amount": d.total_amount,
            "interest_rate": d.interest_rate,
            "monthly_payment": d.monthly_payment,
            "start_date": str(d.start_date) if d.start_date else None
        }
        for d in debts
    ]

@mcp_server.tool()
def create_debt(
    user_id: int, 
    name: str, 
    debt_type: str, 
    balance: float, 
    total_amount: float, 
    interest_rate: float = 0.0, 
    monthly_payment: float = 0.0, 
    start_date: Optional[str] = None
) -> str:
    """Create a new debt for the user.
    debt_type MUST be one of: 'auto', 'credit_card', 'student', 'mortgage', 'personal'.
    start_date must be 'YYYY-MM-DD' if provided.
    """
    if start_date:
        try:
            datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            return "Error: start_date must be in YYYY-MM-DD format."
            
    try:
        debt_data = models.DebtCreate(
            user_id=user_id,
            name=sanitize(name),
            type=debt_type,
            balance=balance,
            total_amount=total_amount,
            interest_rate=interest_rate,
            monthly_payment=monthly_payment,
            start_date=start_date
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
        
    crud.create_debt(debt_data)
    
    # Auto-create recurring transaction for monthly payment
    if monthly_payment > 0:
        rt_start_date = datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else datetime.now().date()
        rt = models.RecurringTransactionCreate(
            user_id=user_id,
            recipient=sanitize(name),
            amount=monthly_payment,
            category=models.TransactionCategory.Bills,
            type=models.TransactionType.expense,
            interval=models.RecurringInterval.monthly,
            start_date=rt_start_date
        )
        crud.create_recurring_transaction(rt)
        sse_bus.emit_event("recurring_changed", user_id)
    
    # Update net worth since debt reduces net worth
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", user_id)
    sse_bus.emit_event("transactions_changed", user_id) # Triggers front-end net-worth card refetch
    
    return f"Successfully created {debt_type} debt '{name}' with balance ${balance}."

@mcp_server.tool()
def update_debt(
    debt_id: int,
    user_id: int, 
    name: str, 
    debt_type: str, 
    balance: float, 
    total_amount: float, 
    interest_rate: float = 0.0, 
    monthly_payment: float = 0.0, 
    start_date: Optional[str] = None
) -> str:
    """Update an existing debt's details.
    debt_type MUST be one of: 'auto', 'credit_card', 'student', 'mortgage', 'personal'.
    start_date must be 'YYYY-MM-DD' if provided.
    """
    existing_debt = crud.get_debt(debt_id)
    if not existing_debt:
        return f"Error: Debt {debt_id} not found."
    if existing_debt.user_id != user_id:
        return f"Error: Debt {debt_id} does not belong to user {user_id}."
        
    if start_date:
        try:
            datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            return "Error: start_date must be in YYYY-MM-DD format."
            
    try:
        debt_data = models.DebtCreate(
            user_id=user_id,
            name=sanitize(name),
            type=debt_type,
            balance=balance,
            total_amount=total_amount,
            interest_rate=interest_rate,
            monthly_payment=monthly_payment,
            start_date=start_date
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
        
    crud.update_debt(debt_id, debt_data)
    
    # Recalculate net worth
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", user_id)
    
    return f"Successfully updated debt {debt_id} ('{name}')."

@mcp_server.tool()
def update_debt_balance(debt_id: int, user_id: int, balance: float) -> str:
    """Update only the current balance of an existing debt."""
    existing_debt = crud.get_debt(debt_id)
    if not existing_debt:
        return f"Error: Debt {debt_id} not found."
    if existing_debt.user_id != user_id:
        return f"Error: Debt {debt_id} does not belong to user {user_id}."
        
    if balance < 0:
        return "Error: Balance cannot be negative."
        
    crud.update_debt_balance(debt_id, balance)
    
    # Recalculate net worth 
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", user_id)
    
    return f"Successfully updated balance for debt {debt_id} to ${balance}."

@mcp_server.tool()
def delete_debt(debt_id: int, user_id: int) -> str:
    """Delete a debt by its ID."""
    existing_debt = crud.get_debt(debt_id)
    if not existing_debt:
        return f"Error: Debt {debt_id} not found."
    if existing_debt.user_id != user_id:
        return f"Error: Debt {debt_id} does not belong to user {user_id}."
        
    crud.delete_debt(debt_id)
    
    # Recalculate net worth since debt is removed
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("debts_changed", user_id)
    
    return f"Successfully deleted debt {debt_id}."

@mcp_server.tool()
def get_tracked_assets(user_id: int) -> list:
    """Get all physical tracked assets/equity for a user.
    Returns a list of dicts representing the assets (real estate, vehicles, etc).
    """
    assets = crud.get_tracked_assets(user_id)
    return [
        {
            "id": a.id,
            "name": a.name,
            "type": a.type,
            "value": a.value
        }
        for a in assets
    ]

@mcp_server.tool()
def add_tracked_asset(
    user_id: int, 
    name: str, 
    asset_type: str, 
    value: float
) -> str:
    """Add a new physical asset (equity) to the user's tracking.
    asset_type MUST be one of: 'real_estate', 'vehicle', 'investment', 'valuable', 'other'.
    """
    try:
        asset_data = models.TrackedAssetCreate(
            user_id=user_id,
            name=sanitize(name),
            type=asset_type,
            value=value
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
        
    crud.create_tracked_asset(asset_data)
    
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", user_id)
    sse_bus.emit_event("transactions_changed", user_id) 
    
    return f"Successfully created {asset_type} asset '{name}' with estimated value ${value}."

@mcp_server.tool()
def update_tracked_asset(
    asset_id: int,
    user_id: int, 
    name: str, 
    asset_type: str, 
    value: float
) -> str:
    """Update an existing tracked asset's details (e.g. updating the market value)."""
    existing_asset = crud.get_tracked_asset(asset_id)
    if not existing_asset:
        return f"Error: Asset {asset_id} not found."
    if existing_asset.user_id != user_id:
        return f"Error: Asset {asset_id} does not belong to user {user_id}."
            
    try:
        asset_data = models.TrackedAssetCreate(
            user_id=user_id,
            name=sanitize(name),
            type=asset_type,
            value=value
        )
    except Exception as e:
        return f"Error: Invalid input — {e}"
        
    crud.update_tracked_asset(asset_id, asset_data)
    
    all_transactions = crud.get_all_transactions()
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", user_id)
    sse_bus.emit_event("transactions_changed", user_id)
    
    return f"Successfully updated asset {asset_id} market value."

@mcp_server.tool()
def delete_tracked_asset(asset_id: int, user_id: int) -> str:
    """Delete a tracked asset by its ID."""
    existing_asset = crud.get_tracked_asset(asset_id)
    if not existing_asset:
        return f"Error: Asset {asset_id} not found."
    if existing_asset.user_id != user_id:
        return f"Error: Asset {asset_id} does not belong to user {user_id}."
        
    crud.delete_tracked_asset(asset_id)
    all_transactions = crud.get_all_transactions(user_id)
    update_networth(user_id, transactions=all_transactions)
    sse_bus.emit_event("tracked_assets_changed", user_id)
    sse_bus.emit_event("transactions_changed", user_id)
    
    return f"Successfully deleted asset {asset_id}."

@mcp_server.tool()
def sync_plaid_transactions(user_id: int) -> str:
    """Sync Plaid bank transactions on-demand and fetch updated balances."""
    try:
        res = sync_plaid_transactions_endpoint(user_id)
        return f"Plaid sync complete: synced {res['synced_items']} bank connection(s), imported {res['transactions_added']} new transaction(s)."
    except Exception as e:
        if hasattr(e, 'detail'):
            return f"Error: {e.detail}"
        return f"Error syncing Plaid: {str(e)}"

@mcp_server.tool()
def get_plaid_accounts(user_id: int) -> list:
    """Get all linked bank accounts (like Discover, Navy Federal) and their current balances."""
    try:
        return get_plaid_accounts_endpoint(user_id)
    except Exception as e:
        return [{"error": f"Failed to retrieve accounts: {str(e)}"}]

@mcp_server.tool()
def get_plaid_insights(user_id: int) -> dict:
    """Analyze and summarize spending outflows and income inflows across linked bank accounts over the last 60 days."""
    try:
        accounts = get_plaid_accounts_endpoint(user_id)
        
        # Calculate cash flow over the last 60 days
        user_txns = crud.get_all_transactions(user_id)
        
        cutoff = datetime.now().date() - timedelta(days=60)
        recent_txns = []
        for t in user_txns:
            try:
                t_date = t.date
                if isinstance(t_date, str):
                    t_date = datetime.strptime(t_date.split(" ")[0], "%Y-%m-%d").date()
                elif hasattr(t_date, 'date'):
                    t_date = t_date.date()
                if t_date >= cutoff:
                    recent_txns.append(t)
            except Exception:
                pass
        
        total_income = 0.0
        total_expense = 0.0
        categories = defaultdict(float)
        plaid_accounts_txns = defaultdict(list)
        
        for t in recent_txns:
            if t.plaid_account_id:
                if t.type == "income":
                    total_income += t.amount
                else:
                    total_expense += t.amount
                    categories[t.category] += t.amount
                plaid_accounts_txns[t.plaid_account_id].append(t)
                
        # Group accounts
        acct_summary = []
        for acct in accounts:
            acct_id = acct['account_id']
            txs = plaid_accounts_txns.get(acct_id, [])
            inflow = sum(tx.amount for tx in txs if tx.type == "income")
            outflow = sum(tx.amount for tx in txs if tx.type == "expense")
            acct_summary.append({
                "name": f"{acct['institution_name']} - {acct['name']}",
                "current_balance": acct['balance_current'],
                "60d_inflow": round(inflow, 2),
                "60d_outflow": round(outflow, 2)
            })
            
        return {
            "period": "Last 60 Days",
            "total_income": round(total_income, 2),
            "total_spending": round(total_expense, 2),
            "net_flow": round(total_income - total_expense, 2),
            "top_categories": {k: round(v, 2) for k, v in sorted(categories.items(), key=lambda x: x[1], reverse=True)},
            "accounts": acct_summary
        }
    except Exception as e:
        return {"error": f"Failed to compute insights: {str(e)}"}

# Mount the MCP server to the FastAPI app
app.mount("/mcp", mcp_server.sse_app())
app.mount("/mcp-http", mcp_server.streamable_http_app())

# --- Background Auto-Processor ---
import asyncio
from datetime import timedelta
from dateutil.relativedelta import relativedelta

async def process_recurring_transactions_loop():
    """Runs continuously in the background, checking for due recurring transactions."""
    while True:
        try:
            current_date = datetime.now().date()
            # For simplicity, we process all users right now. In a multi-user app, you'd iterate users.
            # Here we just fetch user 1 since this is a local app
            user_id = 1
            
            recurring_txns = crud.get_all_recurring_transactions(user_id)
            
            transactions_added = False
            for rt in recurring_txns:
                # We need to process occurrences safely, even if multiple backends run.
                # Instead of holding `next_date` in memory, we try to advance the DB
                # ONE step at a time. If successful, we insert the transaction.
                
                db_next_date = rt.next_date
                
                while db_next_date <= current_date:
                    print(f"Applying recurring transaction: {rt.recipient} for {rt.amount} on {db_next_date}")
                    
                    # 1. Calculate the next iteration date
                    if rt.interval == "daily":
                        advanced_date = db_next_date + relativedelta(days=1)
                    elif rt.interval == "weekly":
                        advanced_date = db_next_date + relativedelta(weeks=1)
                    elif rt.interval == "monthly":
                        advanced_date = db_next_date + relativedelta(months=1)
                    elif rt.interval == "yearly":
                        advanced_date = db_next_date + relativedelta(years=1)
                    else:
                        advanced_date = db_next_date + relativedelta(months=1)  # Fallback
                        
                    # 2. Try to claim this occurrence in the DB atomically
                    rows_updated = crud.advance_recurring_transaction(
                        rt.id, 
                        db_next_date.strftime("%Y-%m-%d"), 
                        advanced_date.strftime("%Y-%m-%d")
                    )
                    
                    if rows_updated == 0:
                        # Another backend already processed this date, skip further processing for this RT in this loop run
                        break
                        
                    # 3. We successfully claimed it! Now insert the transaction
                    new_tx = models.TransactionCreate(
                        user_id=rt.user_id,
                        recipient=rt.recipient,
                        date=db_next_date,
                        amount=rt.amount,
                        category=rt.category,
                        type=rt.type
                    )
                    crud.create_transaction(new_tx)

                    # 4. Generate a notification for this occurrence
                    new_notif = models.NotificationCreate(
                        user_id=rt.user_id,
                        title="Subscription Paid",
                        message=f"{rt.recipient} (${rt.amount:.2f}) was automatically logged to your ledger.",
                        date=datetime.now(),
                        is_read=False,
                        type="system"
                    )
                    crud.create_notification(new_notif)
                    
                    transactions_added = True
                    db_next_date = advanced_date

            # If we added transactions, we need to update assets/net worth
            if transactions_added:
                all_txns = crud.get_all_transactions(user_id)
                update_networth(user_id, transactions=all_txns)
                month_update(user_id, all_txns)
                organize_assets(user_id, all_txns)
                sse_bus.emit_event("transactions_changed", user_id)
                sse_bus.emit_event("notifications_changed", user_id)
                
        except Exception as e:
            print(f"Error processing recurring transactions: {e}")
            
        # Check every 30 seconds so new subscriptions trigger quickly
        await asyncio.sleep(30)



if __name__ == "__main__":
    import uvicorn
    import socket
    import os
    import sys

    # Check command-line arguments for MCP standalone mode
    if len(sys.argv) > 1 and sys.argv[1] in ("mcp", "--mcp"):
        # Default transport is stdio. Support choice via second arg if provided
        transport = "stdio"
        if len(sys.argv) > 2:
            arg2 = sys.argv[2].lower().replace("--", "")
            if arg2 in ("stdio", "sse", "http"):
                transport = arg2
        
        if transport == "stdio":
            print("Starting sAIve MCP server over stdio...", file=sys.stderr, flush=True)
            asyncio.run(mcp_server.run_stdio_async())
        elif transport == "sse":
            port = 48356
            if len(sys.argv) > 3:
                try:
                    port = int(sys.argv[3])
                except ValueError:
                    pass
            print(f"Starting sAIve MCP server over SSE on port {port}...", file=sys.stderr, flush=True)
            mcp_server.settings.port = port
            asyncio.run(mcp_server.run_sse_async())
        elif transport == "http":
            port = 48356
            if len(sys.argv) > 3:
                try:
                    port = int(sys.argv[3])
                except ValueError:
                    pass
            print(f"Starting sAIve MCP server over HTTP on port {port}...", file=sys.stderr, flush=True)
            mcp_server.settings.port = port
            asyncio.run(mcp_server.run_streamable_http_async())
        sys.exit(0)

    # Check if we are running in a cloud environment (e.g., Railway sets PORT)
    env_port = os.getenv("PORT")

    if env_port:
        print(f"Starting in cloud mode on port {env_port}")
        uvicorn.run(app, host="0.0.0.0", port=int(env_port), log_level="info")
    else:
        # Let the OS assign a free port (Local Electron behavior)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
        sock.close()

        # Signal the port to Electron (must be flushed immediately)
        print(f"PORT:{port}", flush=True)

        uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
