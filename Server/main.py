from datetime import datetime
import time
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
import crud
import database
from typing import List, Optional
from collections import defaultdict

app = FastAPI()

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

# User Asset endpoints

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
    crud.delete_transaction(transaction_id)
    # Recalculate monthly stats after deletion (simplified for now, ideally strictly by date)
    # For now we just return success, user might need to trigger a recalc or we do it here.
    # To do it properly we should get the transaction details first to know which month to update.
    # But for now, let's just delete.
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

        if not monTransactions:
            continue  # No transactions for this asset, skip to next

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
