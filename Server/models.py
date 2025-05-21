from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum

class User(BaseModel):
    id: int
    name: str
    net_worth: float

class UserAsset(BaseModel):
    id: Optional[int] = None
    user_id: int
    year: int
    month: int
    TIncome: float
    TExpense: float
    TSavings: float
    net_worth: float

class UserAssetWithUser(BaseModel):
    asset: UserAsset
    previous_asset: Optional[UserAsset] = None
    user: User

class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

class Transaction(BaseModel):
    id: int
    user_id: int
    recipient: str
    date: date
    amount: float
    category: str
    type: TransactionType

class TransactionCreate(BaseModel):
    user_id: int
    recipient: str
    date: date
    amount: float
    category: str
    type: TransactionType