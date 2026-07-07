from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date, datetime
import datetime as dt
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


class TrackedAssetType(str, Enum):
    real_estate  = "real_estate"
    vehicle      = "vehicle"
    investment   = "investment"
    valuable     = "valuable"
    other        = "other"


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

def _validate_category(v: str) -> str:
    """Strip whitespace and enforce a max length for transaction categories."""
    v = v.strip()
    if not v:
        raise ValueError("category must not be blank")
    if len(v) > 100:
        raise ValueError("category must be 100 characters or fewer")
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
    category: str
    type: TransactionType
    debt_id: Optional[int] = None
    plaid_transaction_id: Optional[str] = None
    plaid_account_id: Optional[str] = None
    account_name: Optional[str] = None


class TransactionCreate(BaseModel):
    user_id: int
    recipient: str
    date: date
    amount: float
    category: str
    type: TransactionType
    debt_id: Optional[int] = None
    plaid_transaction_id: Optional[str] = None
    plaid_account_id: Optional[str] = None
    account_name: Optional[str] = None

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

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: str) -> str:
        return _validate_category(v)


class TransactionUpdate(BaseModel):
    recipient: Optional[str] = None
    date: Optional[dt.date] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    type: Optional[TransactionType] = None
    debt_id: Optional[int] = None
    
    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            return _validate_amount(v)
        return v

    @field_validator("date", mode="before")
    @classmethod
    def validate_date(cls, v) -> Optional[dt.date]:
        if v is not None:
            return _validate_date(v)
        return v

    @field_validator("recipient", mode="before")
    @classmethod
    def validate_recipient(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return _validate_recipient(v)
        return v

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return _validate_category(v)
        return v


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

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: str) -> str:
        return _validate_category(v)


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

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        return _validate_amount(v)

    @field_validator("category", mode="before")
    @classmethod
    def validate_category(cls, v: str) -> str:
        return _validate_category(v)


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
    linked_asset_id: Optional[int] = None


class DebtCreate(BaseModel):
    user_id: int
    name: str
    type: DebtType
    balance: float
    total_amount: float
    interest_rate: float = 0.0
    monthly_payment: float = 0.0
    start_date: Optional[date] = None
    linked_asset_id: Optional[int] = None

    @field_validator("balance", "total_amount", mode="after")
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


class TrackedAsset(BaseModel):
    id: int
    user_id: int
    name: str
    type: str
    value: float


class TrackedAssetCreate(BaseModel):
    user_id: int
    name: str
    type: TrackedAssetType
    value: float

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return _validate_recipient(v)

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: float) -> float:
        # Can be zero or negative theoretically if underwater, but generally we want it positive
        # For now, let's just use the general _validate_amount which enforces > 0
        # If they need to log a negative physical asset (?) they probably shouldn't.
        if v < 0:
            raise ValueError("Asset value cannot be negative. Log a debt instead.")
        if v > MAX_AMOUNT:
            raise ValueError(f"Value must not exceed ${MAX_AMOUNT:,.0f}")
        return v


class BalanceUpdate(BaseModel):
    balance: float


class PlaidConfig(BaseModel):
    client_id: str
    secret: str
    env: str


class PlaidExchangeToken(BaseModel):
    public_token: str


class PlaidAccountInfo(BaseModel):
    account_id: str
    name: str
    mask: Optional[str] = None
    type: str
    subtype: Optional[str] = None
    balance_available: Optional[float] = None
    balance_current: Optional[float] = None
    balance_limit: Optional[float] = None


class PlaidItemInfo(BaseModel):
    item_id: str
    institution_name: str
    status: str
    accounts: list[PlaidAccountInfo]


class Category(BaseModel):
    id: Optional[int] = None
    name: str
    color: Optional[str] = None


class CategoryCreate(BaseModel):
    name: str
    color: Optional[str] = None

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return _validate_category(v)

