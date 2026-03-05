from datetime import datetime
import time
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
    allow_origins=origins,
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
    
    all_transactions = crud.get_all_transactions()
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
    time.sleep(.05)
    return crud.get_all_user_assets(user_id)
@app.get("/user_assets/{user_id}/category", response_model=List[models.AssetCategory])
def get_category_summary(user_id: int):
    return crud.get_assets_by_all_category(user_id)

# Transaction endpoints
@app.post("/transactions/")
def create_transaction(transaction: models.TransactionCreate):
    crud.create_transaction(transaction)

    all_transactions = crud.get_all_transactions()

    month_update(transaction.user_id, all_transactions)
    organize_assets(transaction.user_id, all_transactions)
    update_networth(transaction.user_id, transactions = all_transactions)
    sse_bus.emit_event("transactions_changed", transaction.user_id)
    return {"detail": "Transaction created successfully"}

@app.get("/transactions/", response_model=list[models.Transaction])
def get_all_transactions():
    transactions = crud.get_all_transactions()
    month_update(1, transactions)
    
    return transactions

@app.get("/transactions/{transaction_id}", response_model=models.Transaction)
def read_transaction(transaction_id: int):
    db_transaction = crud.get_transaction(transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int):
    # Get transaction details first to know which user to update
    transaction = crud.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    user_id = transaction.user_id
    crud.delete_transaction(transaction_id)
    
    all_transactions = crud.get_all_transactions()
    user_transactions = [t for t in all_transactions if t.user_id == user_id]
    
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
    if transaction:
        if transaction.type == "income":
            user.net_worth += transaction.amount

        elif transaction.type == "expense":
            user.net_worth -= transaction.amount
    elif transactions:
        user.net_worth = 0  # Reset net worth for batch processing
        # Calculate net worth based on all transactions
        for tx in transactions:
            if tx.type == "income":
                user.net_worth += tx.amount
            elif tx.type == "expense":
                user.net_worth -= tx.amount

    crud.update_user(user_id, user)

def month_update(user_id: int, transactions: list[models.TransactionCreate]):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    CURR_DATE = datetime.now()

    curr_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month)
    last_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month - 1) if CURR_DATE.month > 1 else crud.get_user_asset(user_id, CURR_DATE.year - 1, 12)


    TotalIncome = 0
    TotalExpense = 0
    TotalSavings = 0
    OverFlow = 0
    if last_asset is not None: 
        OverFlow = last_asset.TSavings
    curr_net_worth = user.net_worth

    if curr_asset is None or not crud.has_asset(user_id):
        user_asset_obj = models.UserAsset(
            user_id=user_id,
            year=CURR_DATE.year,
            month=CURR_DATE.month,
            TIncome=TotalIncome,
            TExpense=TotalExpense,
            TSavings=TotalSavings,
            net_worth=curr_net_worth
        )
        crud.create_user_asset(user_asset_obj)
    for transaction in transactions:
        if transaction.date.month == CURR_DATE.month and transaction.date.year == CURR_DATE.year:
            if transaction.type == "income":
                TotalIncome += transaction.amount
            elif transaction.type == "expense":
                TotalExpense += transaction.amount
    TotalIncome += OverFlow
    TotalSavings = TotalIncome - TotalExpense 
    user_asset = crud.get_user_asset(user_id, CURR_DATE.year, CURR_DATE.month)
    if user_asset is None:
        raise HTTPException(status_code=404, detail="User asset not found")
    user_asset_obj = models.UserAsset(
        id=user_asset.id,  # or the correct id
        user_id=user_id,
        year=CURR_DATE.year,
        month=CURR_DATE.month,
        TIncome=TotalIncome,
        TExpense=TotalExpense,
        TSavings=TotalSavings,
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
        

        # Update the asset with the new totals
        asset.TIncome = TotalIncome
        asset.TExpense = TotalExpense
        asset.TSavings = TotalSavings
        asset.net_worth = asset.TSavings
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

# --- MCP Server Integration ---
from mcp.server.fastmcp import FastMCP

mcp_server = FastMCP("sAIve")

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
    all_transactions = crud.get_all_transactions()
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
        all_transactions = crud.get_all_transactions()
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
    all_transactions = crud.get_all_transactions()
    user_transactions = [t for t in all_transactions if t.user_id == user_id]
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

# Mount the MCP server to the FastAPI app at /mcp
app.mount("/mcp", mcp_server.sse_app())

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
                # Use a while loop so ALL overdue occurrences are applied in one
                # pass — e.g. a monthly subscription 3 months overdue gets 3
                # transactions inserted before we sleep again.
                next_date = rt.next_date  # track locally; write to DB once at end
                while next_date <= current_date:
                    print(f"Applying recurring transaction: {rt.recipient} for {rt.amount} on {next_date}")
                    # 1. Insert the realized transaction into the ledger
                    new_tx = models.TransactionCreate(
                        user_id=rt.user_id,
                        recipient=rt.recipient,
                        date=next_date,
                        amount=rt.amount,
                        category=rt.category,
                        type=rt.type
                    )
                    crud.create_transaction(new_tx)

                    # 2. Generate a notification for this occurrence
                    new_notif = models.NotificationCreate(
                        user_id=rt.user_id,
                        title="Subscription Paid",
                        message=f"{rt.recipient} (${rt.amount:.2f}) was automatically logged to your ledger.",
                        date=datetime.now(),
                        is_read=False,
                        type="system"
                    )
                    crud.create_notification(new_notif)

                    # 3. Advance next_date by one interval
                    if rt.interval == "daily":
                        next_date = next_date + relativedelta(days=1)
                    elif rt.interval == "weekly":
                        next_date = next_date + relativedelta(weeks=1)
                    elif rt.interval == "monthly":
                        next_date = next_date + relativedelta(months=1)
                    elif rt.interval == "yearly":
                        next_date = next_date + relativedelta(years=1)
                    else:
                        next_date = next_date + relativedelta(months=1)  # Fallback

                    transactions_added = True

                # 4. Write the final next_date to the DB once (outside the while)
                if next_date != rt.next_date:
                    crud.update_recurring_transaction_next_date(rt.id, next_date.strftime("%Y-%m-%d"))

            # If we added transactions, we need to update assets/net worth
            if transactions_added:
                all_txns = crud.get_all_transactions()
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
