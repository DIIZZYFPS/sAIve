from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime
from enum import Enum

# ── Constants ────────────────────────────────────────────────────────────────
MAX_AMOUNT: float = 1_000_000_000.0   # $1 billion hard cap per transaction/budget
MIN_DATE: date = date(1900, 1, 1)
MAX_RECIPIENT_LEN: int = 200

# ── Enums ────────────────────────────────────────────────────────────────────

class TransactionType(str, Enum):
    income  = "income"
    expense = "expense"


class TransactionCategory(str, Enum):
    """Strict whitelist of allowed categories.
    Income uses lowercase 'income' to stay compatible with existing DB rows
    written by the onboarding endpoint.
    """
    Housing        = "Housing"
    Food           = "Food"
    Transportation = "Transportation"
    Subscriptions  = "Subscriptions"
    Bills          = "Bills"
    Income         = "Income"
    Debt_Payment   = "Debt Payment"
    Other          = "Other"


class RecurringInterval(str, Enum):
    daily   = "daily"
    weekly  = "weekly"
    monthly = "monthly"
    yearly  = "yearly"


class DebtType(str, Enum):
    auto         = "auto"
    credit_card  = "credit_card"
    student      = "student"
    mortgage     = "mortgage"
    personal     = "personal"


# ── Shared Validators ─────────────────────────────────────────────────────────

def _validate_amount(v: float) -> float:
    """Amount must be a positive number no greater than MAX_AMOUNT."""
    if v <= 0:
        raise ValueError("amount must be a positive number greater than zero")
    if v > MAX_AMOUNT:
        raise ValueError(f"amount must not exceed ${MAX_AMOUNT:,.0f}")
    return v

def _validate_date(v) -> date:
    """Date must be between 1900-01-01 and today (no future dates)."""
    if isinstance(v, str):
        try:
            v = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("date must be in YYYY-MM-DD format")
    today = date.today()
    if not (MIN_DATE <= v <= today):
        raise ValueError(
            f"date must be between {MIN_DATE} and today ({today})"
        )
    return v

def _validate_recipient(v: str) -> str:
    """Strip whitespace and enforce a max length to limit XSS payload size."""
    v = v.strip()
    if not v:
        raise ValueError("recipient must not be blank")
    if len(v) > MAX_RECIPIENT_LEN:
        raise ValueError(f"recipient must be {MAX_RECIPIENT_LEN} characters or fewer")
    return v


# ── Models ────────────────────────────────────────────────────────────────────

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


class Transaction(BaseModel):
    id: int
    user_id: int
    recipient: str
    date: date
    amount: float
    category: str          # str (not enum) so existing non-whitelisted rows still deserialise
    type: TransactionType
    debt_id: Optional[int] = None


class TransactionCreate(BaseModel):
    user_id: int
    recipient: str
    date: date
    amount: float
    category: TransactionCategory
    type: TransactionType
    debt_id: Optional[int] = None

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        return _validate_amount(v)

    @field_validator("date", mode="before")
    @classmethod
    def validate_date(cls, v) -> date:
        return _validate_date(v)

    @field_validator("recipient", mode="before")
    @classmethod
    def validate_recipient(cls, v: str) -> str:
        return _validate_recipient(v)


class RecurringTransaction(BaseModel):
    id: int
    user_id: int
    recipient: str
    amount: float
    category: str          # str so existing rows deserialise freely
    type: TransactionType
    interval: RecurringInterval
    start_date: date
    next_date: date


class RecurringTransactionCreate(BaseModel):
    user_id: int
    recipient: str
    amount: float
    category: TransactionCategory
    type: TransactionType
    interval: RecurringInterval
    start_date: date

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        return _validate_amount(v)

    @field_validator("start_date", mode="before")
    @classmethod
    def validate_start_date(cls, v) -> date:
        return _validate_date(v)

    @field_validator("recipient", mode="before")
    @classmethod
    def validate_recipient(cls, v: str) -> str:
        return _validate_recipient(v)


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
    category: TransactionCategory
    amount: float

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        return _validate_amount(v)


class Debt(BaseModel):
    id: int
    user_id: int
    name: str
    type: str
    balance: float
    total_amount: float
    interest_rate: float
    monthly_payment: float
    start_date: Optional[date] = None


class DebtCreate(BaseModel):
    user_id: int
    name: str
    type: DebtType
    balance: float
    total_amount: float
    interest_rate: float = 0.0
    monthly_payment: float = 0.0
    start_date: Optional[date] = None

    @field_validator("balance", "total_amount", mode="before")
    @classmethod
    def validate_nonneg(cls, v: float) -> float:
        if v < 0:
            raise ValueError("balance and total_amount must be non-negative")
        if v > MAX_AMOUNT:
            raise ValueError(f"value must not exceed ${MAX_AMOUNT:,.0f}")
        return v

    @field_validator("start_date", mode="before")
    @classmethod
    def validate_start_date(cls, v):
        if v is None:
            return v
        return _validate_date(v)


class BalanceUpdate(BaseModel):
    balance: float
