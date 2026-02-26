from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
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

class AssetCategory(BaseModel):
    category: str
    Amount: float


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

class RecurringInterval(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class RecurringTransaction(BaseModel):
    id: int
    user_id: int
    recipient: str
    amount: float
    category: str
    type: TransactionType
    interval: RecurringInterval
    start_date: date
    next_date: date

class RecurringTransactionCreate(BaseModel):
    user_id: int
    recipient: str
    amount: float
    category: str
    type: TransactionType
    interval: RecurringInterval
    start_date: date

class Notification(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    date: datetime
    is_read: bool
    type: str

class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    date: datetime
    is_read: bool = False
    type: str

class Budget(BaseModel):
    id: int
    user_id: int
    category: str
    amount: float

class BudgetCreate(BaseModel):
    user_id: int
    category: str
    amount: float