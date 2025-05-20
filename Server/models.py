from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class User(BaseModel):
    id: int
    name: str
    net_worth: float

class UserAsset(BaseModel):
    id: int
    user_id: int
    year: int
    month: int
    TIncome: float
    TExpense: float
    TSavings: float

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class Transaction(BaseModel):
    id: int
    user_id: int
    recipient: str
    date: datetime
    amount: float
    category: str
    type: TransactionType