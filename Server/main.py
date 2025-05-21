from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
import crud
import database

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://localhost:5173",
]

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

# Transaction endpoints
@app.post("/transactions/")
def create_transaction(transaction: models.TransactionCreate):
    crud.create_transaction(transaction)
    update_networth(transaction.user_id, transaction)
    return {"detail": "Transaction created successfully"}
@app.get("/transactions/", response_model=list[models.Transaction])
def get_all_transactions():
    transactions = crud.get_all_transactions()
    month_update(transactions[0].user_id, transactions)
    return transactions

@app.get("/transactions/{transaction_id}", response_model=models.Transaction)
def read_transaction(transaction_id: int):
    db_transaction = crud.get_transaction(transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


# Non endpoint functions

def update_networth(user_id: int, transaction: models.TransactionCreate):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if transaction.type == "income":
        user.net_worth += transaction.amount

    elif transaction.type == "expense":
        user.net_worth -= transaction.amount

    crud.update_user(user_id, user)

def month_update(user_id: int, transactions: list[models.TransactionCreate]):
    user = crud.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    CURR_DATE = datetime.now()
    TotalIncome = 0
    TotalExpense = 0
    TotalSavings = 0
    curr_net_worth = user.net_worth

    if CURR_DATE.day == 1 or not crud.has_asset(user_id):
        user_asset_obj = models.UserAsset(
            user_id=user_id,
            year=CURR_DATE.year,
            month=CURR_DATE.month,
            TIncome=TotalIncome,
            TExpense=TotalExpense,
            TSavings=TotalSavings,
            curr_net_worth=curr_net_worth
        )
        crud.create_user_asset(user_asset_obj)
    for transaction in transactions:
        if transaction.type == "income":
            TotalIncome += transaction.amount
        elif transaction.type == "expense":
            TotalExpense += transaction.amount
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
        curr_net_worth=curr_net_worth
    )
    crud.update_user_asset(user_asset_obj)

