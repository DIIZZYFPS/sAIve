from typing import Optional, List
from database import create_connection
from models import User, UserAsset, Transaction, TransactionCreate, TransactionUpdate, Budget, BudgetCreate, Debt, DebtCreate

def create_user(user: User):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO users (name, net_worth)
        VALUES (?, ?)
    ''', (user.name, user.net_worth))

    conn.commit()
    conn.close()
    return user
def get_user(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM users WHERE id = ?
    ''', (user_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return User(id=row['id'], name=row['name'], net_worth=row['net_worth'])
    return None
def update_user(user_id: int, user: User):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE users
        SET name = ?, net_worth = ?
        WHERE id = ?
    ''', (user.name, user.net_worth, user_id))

    conn.commit()
    conn.close()
    return user
def delete_user(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        DELETE FROM users WHERE id = ?
    ''', (user_id,))

    conn.commit()
    conn.close()

def create_user_asset(user_asset: UserAsset):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO user_assets (user_id, year, month, TIncome, TExpense, TSavings, NetWorth)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_asset.user_id, user_asset.year, user_asset.month, user_asset.TIncome, user_asset.TExpense, user_asset.TSavings, user_asset.net_worth))

    conn.commit()
    conn.close()
    return user_asset
def get_user_asset(user_asset_id: int, current_year: int, current_month: int ):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM user_assets WHERE user_id = ? AND year = ? AND month = ?
    ''', (user_asset_id, current_year, current_month))

    row = cursor.fetchone()
    conn.close()

    if row:
        return UserAsset(id=row['id'], user_id=row['user_id'], year=row['year'], month=row['month'], TIncome=row['TIncome'], TExpense=row['TExpense'], TSavings=row['TSavings'], net_worth=row['NetWorth'])
    return None

def has_asset(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM user_assets WHERE user_id = ?
    ''', (user_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return True
    return False


def update_user_asset(user_asset: UserAsset):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE user_assets
        SET user_id = ?, year = ?, month = ?, TIncome = ?, TExpense = ?, TSavings = ?, NetWorth = ?
        WHERE id = ?
    ''', (user_asset.user_id, user_asset.year, user_asset.month, user_asset.TIncome, user_asset.TExpense, user_asset.TSavings, user_asset.net_worth, user_asset.id))

    conn.commit()
    conn.close()
    return user_asset

def get_all_user_assets(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM user_assets
        WHERE user_id = ?
    ''', (user_id,))

    rows = cursor.fetchall()
    conn.close()

    user_assets = []
    for row in rows:
        user_assets.append(UserAsset(id=row['id'], user_id=row['user_id'], year=row['year'], month=row['month'], TIncome=row['TIncome'], TExpense=row['TExpense'], TSavings=row['TSavings'], net_worth=row['NetWorth']))
    
    return user_assets

def get_assets_by_all_category(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   SELECT category, SUM(amount) as total_amount
                     FROM transactions
                     WHERE user_id = ?
                     GROUP BY category
                     ORDER BY category
    ''', (user_id,))

    rows = cursor.fetchall()
    conn.close()

    cat_spends = []
    for row in rows:
        cat_spends.append({'category': row['category'], 'Amount': row['total_amount']})

    return cat_spends

def delete_user_asset(user_asset_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        DELETE FROM user_assets WHERE id = ?
    ''', (user_asset_id,))

    conn.commit()
    conn.close()

def _row_to_transaction(row) -> Transaction:
    return Transaction(
        id=row['id'],
        user_id=row['user_id'],
        date=row['date'],
        amount=row['amount'],
        category=row['category'],
        type=row['type'],
        recipient=row['recipient'],
        debt_id=row['debt_id'] if 'debt_id' in row.keys() else None,
        plaid_transaction_id=row['plaid_transaction_id'] if 'plaid_transaction_id' in row.keys() else None,
        plaid_account_id=row['plaid_account_id'] if 'plaid_account_id' in row.keys() else None
    )

def create_transaction(transaction: TransactionCreate):
    conn = create_connection()
    cursor = conn.cursor()

    if transaction.plaid_transaction_id:
        cursor.execute('SELECT id FROM transactions WHERE plaid_transaction_id = ?', (transaction.plaid_transaction_id,))
        if cursor.fetchone():
            conn.close()
            return None  # Transaction already exists

    # Auto-match rules
    if not transaction.debt_id or not transaction.category or transaction.category == "Other":
        rule = get_matching_rule(transaction.recipient)
        if rule:
            if not transaction.debt_id and rule['debt_id']:
                transaction.debt_id = rule['debt_id']
            if (not transaction.category or transaction.category == "Other") and rule['category']:
                transaction.category = rule['category']

    # Dynamically register category if it doesn't exist
    cursor.execute('SELECT COUNT(*) FROM categories WHERE name = ?', (transaction.category,))
    if cursor.fetchone()[0] == 0:
        cursor.execute('INSERT INTO categories (name, color) VALUES (?, ?)', (transaction.category, 'muted'))
        conn.commit()

    cursor.execute('''
        INSERT INTO transactions (user_id, date, amount, category, recipient, type, debt_id, plaid_transaction_id, plaid_account_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        transaction.user_id,
        transaction.date,
        transaction.amount,
        transaction.category,
        transaction.recipient,
        transaction.type,
        transaction.debt_id,
        transaction.plaid_transaction_id,
        transaction.plaid_account_id
    ))

    tx_id = cursor.lastrowid
    
    # Adjust debt balance on create
    if transaction.debt_id and transaction.type == "expense":
        cursor.execute('UPDATE debts SET balance = MAX(balance - ?, 0) WHERE id = ?', (transaction.amount, transaction.debt_id))

    conn.commit()
    conn.close()
    return tx_id

def update_transaction(
    transaction_id: int, 
    updated: TransactionUpdate, 
    apply_category_rule: bool = False, 
    apply_debt_rule: bool = False
) -> Optional[Transaction]:
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM transactions WHERE id = ?', (transaction_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    old_tx = _row_to_transaction(row)

    update_data = updated.model_dump(exclude_unset=True)
    if not update_data:
        conn.close()
        return old_tx

    # Dynamically register category if it doesn't exist
    new_category = update_data.get('category', old_tx.category)
    if new_category:
        cursor.execute('SELECT COUNT(*) FROM categories WHERE name = ?', (new_category,))
        if cursor.fetchone()[0] == 0:
            cursor.execute('INSERT INTO categories (name, color) VALUES (?, ?)', (new_category, 'muted'))
            conn.commit()

    new_recipient = update_data.get('recipient', old_tx.recipient)
    new_date = update_data.get('date', old_tx.date)
    new_amount = update_data.get('amount', old_tx.amount)
    new_type = update_data.get('type', old_tx.type)
    
    has_debt_update = 'debt_id' in update_data
    new_debt_id = update_data.get('debt_id', old_tx.debt_id) if has_debt_update else old_tx.debt_id

    # Adjust debt balances on update
    old_is_payment = (old_tx.type == "expense")
    new_is_payment = (new_type == "expense")

    if old_tx.debt_id != new_debt_id or old_is_payment != new_is_payment or (old_tx.debt_id == new_debt_id and old_tx.amount != new_amount):
        if old_tx.debt_id and old_is_payment:
            cursor.execute('UPDATE debts SET balance = balance + ? WHERE id = ?', (old_tx.amount, old_tx.debt_id))
        if new_debt_id and new_is_payment:
            cursor.execute('UPDATE debts SET balance = MAX(balance - ?, 0) WHERE id = ?', (new_amount, new_debt_id))

    cursor.execute('''
        UPDATE transactions
        SET recipient = ?, date = ?, amount = ?, category = ?, type = ?, debt_id = ?
        WHERE id = ?
    ''', (
        new_recipient,
        new_date.strftime("%Y-%m-%d") if hasattr(new_date, "strftime") else str(new_date),
        new_amount,
        new_category,
        new_type,
        new_debt_id,
        transaction_id
    ))

    # Bulk match updates (past transactions) if flags are enabled
    if apply_category_rule or apply_debt_rule:
        pattern = new_recipient.strip().lower()
        create_or_update_transaction_rule(
            pattern=pattern,
            debt_id=new_debt_id if apply_debt_rule else None,
            category=new_category if apply_category_rule else None,
            cursor=cursor
        )
        
        # We sweep and update all historical transactions that match the pattern
        cursor.execute("SELECT id FROM transactions WHERE recipient LIKE ? AND id != ?", (f"%{pattern}%", transaction_id))
        matching_ids = [r[0] for r in cursor.fetchall()]
        
        conn.commit()
        conn.close()
        
        for mid in matching_ids:
            update_fields = {}
            if apply_category_rule:
                update_fields['category'] = new_category
            if apply_debt_rule:
                update_fields['debt_id'] = new_debt_id
                
            tx_updated = TransactionUpdate(**update_fields)
            update_transaction(mid, tx_updated, apply_category_rule=False, apply_debt_rule=False)
            
        return get_transaction(transaction_id)
    else:
        conn.commit()
        conn.close()
        return get_transaction(transaction_id)

def get_transaction(transaction_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM transactions WHERE id = ?
    ''', (transaction_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return _row_to_transaction(row)
    return None

def get_all_transactions():
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM transactions
        ORDER BY date ASC
    ''')

    rows = cursor.fetchall()
    conn.close()

    transactions = []
    for row in rows:
        transactions.append(_row_to_transaction(row))
    
    return transactions

def get_transactions_by_month(user_id: int, year: int, month: int):
    conn = create_connection()
    cursor = conn.cursor()

    # Use strftime to extract year and month from the YYYY-MM-DD date string
    cursor.execute('''
        SELECT * FROM transactions
        WHERE user_id = ?
        AND CAST(strftime('%Y', date) AS INTEGER) = ?
        AND CAST(strftime('%m', date) AS INTEGER) = ?
        ORDER BY date ASC
    ''', (user_id, year, month))

    rows = cursor.fetchall()
    conn.close()

    transactions = []
    for row in rows:
        transactions.append(_row_to_transaction(row))
    
    return transactions


def delete_transaction(transaction_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT type, amount, debt_id FROM transactions WHERE id = ?', (transaction_id,))
    tx = cursor.fetchone()
    if tx and tx['debt_id'] and tx['type'] == "expense":
        cursor.execute('UPDATE debts SET balance = balance + ? WHERE id = ?', (tx['amount'], tx['debt_id']))

    cursor.execute('''
        DELETE FROM transactions WHERE id = ?
    ''', (transaction_id,))

    conn.commit()
    conn.close()

# --- Recurring Transactions ---

from models import RecurringTransaction, RecurringTransactionCreate, Notification, NotificationCreate

def create_recurring_transaction(rt: RecurringTransactionCreate):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO recurring_transactions 
        (user_id, amount, category, recipient, type, interval, start_date, next_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        rt.user_id,
        rt.amount,
        rt.category,
        rt.recipient,
        rt.type,
        rt.interval,
        rt.start_date,
        rt.start_date # Initially, next_date is the start_date
    ))

    conn.commit()
    conn.close()

def get_recurring_transaction(rt_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM recurring_transactions WHERE id = ?
    ''', (rt_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return RecurringTransaction(
            id=row['id'],
            user_id=row['user_id'],
            amount=row['amount'],
            category=row['category'],
            recipient=row['recipient'],
            type=row['type'],
            interval=row['interval'],
            start_date=row['start_date'],
            next_date=row['next_date']
        )
    return None

def get_all_recurring_transactions(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM recurring_transactions
        WHERE user_id = ?
        ORDER BY next_date ASC
    ''', (user_id,))

    rows = cursor.fetchall()
    conn.close()

    rts = []
    for row in rows:
        rts.append(RecurringTransaction(
            id=row['id'],
            user_id=row['user_id'],
            amount=row['amount'],
            category=row['category'],
            recipient=row['recipient'],
            type=row['type'],
            interval=row['interval'],
            start_date=row['start_date'],
            next_date=row['next_date']
        ))
    
    return rts

def update_recurring_transaction_next_date(rt_id: int, next_date: str):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE recurring_transactions
        SET next_date = ?
        WHERE id = ?
    ''', (next_date, rt_id))

    conn.commit()
    conn.close()

def advance_recurring_transaction(rt_id: int, old_date: str, new_date: str) -> int:
    """Atomically updates the advance date. Returns number of rows affected."""
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE recurring_transactions
        SET next_date = ?
        WHERE id = ? AND next_date = ?
    ''', (new_date, rt_id, old_date))

    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected

def update_recurring_transaction(rt_id: int, rt: RecurringTransactionCreate):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE recurring_transactions
        SET amount = ?, category = ?, recipient = ?, type = ?, interval = ?
        WHERE id = ?
    ''', (rt.amount, rt.category, rt.recipient, rt.type, rt.interval, rt_id))

    conn.commit()
    conn.close()

def delete_recurring_transaction(rt_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        DELETE FROM recurring_transactions WHERE id = ?
    ''', (rt_id,))

    conn.commit()
    conn.close()

# --- Notifications ---

def create_notification(notification: NotificationCreate):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO notifications 
        (user_id, title, message, date, is_read, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        notification.user_id,
        notification.title,
        notification.message,
        notification.date,
        notification.is_read,
        notification.type
    ))

    conn.commit()
    conn.close()

def get_notification(notification_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM notifications WHERE id = ?
    ''', (notification_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return Notification(
            id=row['id'],
            user_id=row['user_id'],
            title=row['title'],
            message=row['message'],
            date=row['date'],
            is_read=row['is_read'],
            type=row['type']
        )
    return None

def get_user_notifications(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM notifications 
        WHERE user_id = ?
        ORDER BY date DESC
        LIMIT 50
    ''', (user_id,))
    
    rows = cursor.fetchall()
    conn.close()

    notifications = []
    for row in rows:
        notifications.append(Notification(
            id=row['id'],
            user_id=row['user_id'],
            title=row['title'],
            message=row['message'],
            date=row['date'],
            is_read=row['is_read'],
            type=row['type']
        ))
    
    return notifications

def mark_notification_read(notification_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE notifications SET is_read = 1 WHERE id = ?
    ''', (notification_id,))

    conn.commit()
    conn.close()

def mark_all_notifications_read(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE notifications SET is_read = 1 WHERE user_id = ?
    ''', (user_id,))

    conn.commit()
    conn.close()

def delete_notification(notification_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        DELETE FROM notifications WHERE id = ?
    ''', (notification_id,))

    conn.commit()
    conn.close()

# --- Budgets ---

def get_budgets(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM budgets WHERE user_id = ?
    ''', (user_id,))

    rows = cursor.fetchall()
    conn.close()

    budgets = []
    for row in rows:
        budgets.append(Budget(
            id=row['id'],
            user_id=row['user_id'],
            category=row['category'],
            amount=row['amount']
        ))
    
    return budgets

def set_budget(budget: BudgetCreate):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO budgets (user_id, category, amount)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, category) 
        DO UPDATE SET amount = excluded.amount;
    ''', (budget.user_id, budget.category, budget.amount))

    conn.commit()
    conn.close()

# --- Debts ---

def create_debt(debt: DebtCreate) -> Debt:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO debts (user_id, name, type, balance, total_amount, interest_rate, monthly_payment, start_date, linked_asset_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (debt.user_id, debt.name, debt.type, debt.balance, debt.total_amount,
          debt.interest_rate, debt.monthly_payment, debt.start_date, debt.linked_asset_id))
    conn.commit()
    debt_id = cursor.lastrowid
    conn.close()
    return get_debt(debt_id)

def get_debts(user_id: int) -> list:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM debts WHERE user_id = ? ORDER BY id ASC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_debt(r) for r in rows]

def get_debts_by_type(user_id: int, debt_type: str) -> list:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM debts WHERE user_id = ? AND type = ? ORDER BY id ASC', (user_id, debt_type))
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_debt(r) for r in rows]

def get_debt(debt_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM debts WHERE id = ?', (debt_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_debt(row) if row else None

def update_debt(debt_id: int, debt: DebtCreate) -> Debt:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE debts
        SET name = ?, type = ?, balance = ?, total_amount = ?,
            interest_rate = ?, monthly_payment = ?, start_date = ?, linked_asset_id = ?
        WHERE id = ?
    ''', (debt.name, debt.type, debt.balance, debt.total_amount,
          debt.interest_rate, debt.monthly_payment, debt.start_date, debt.linked_asset_id, debt_id))
    conn.commit()
    conn.close()
    return get_debt(debt_id)

def update_debt_balance(debt_id: int, new_balance: float):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE debts SET balance = ? WHERE id = ?', (max(new_balance, 0), debt_id))
    conn.commit()
    conn.close()

def delete_debt(debt_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM debts WHERE id = ?', (debt_id,))
    conn.commit()
    conn.close()

def get_total_debt_balance(user_id: int) -> float:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COALESCE(SUM(balance), 0) FROM debts WHERE user_id = ?', (user_id,))
    total = cursor.fetchone()[0]
    conn.close()
    return total

def _row_to_debt(row) -> Debt:
    return Debt(
        id=row['id'],
        user_id=row['user_id'],
        name=row['name'],
        type=row['type'],
        balance=row['balance'],
        total_amount=row['total_amount'],
        interest_rate=row['interest_rate'],
        monthly_payment=row['monthly_payment'],
        start_date=row['start_date'],
        linked_asset_id=row['linked_asset_id'] if 'linked_asset_id' in row.keys() else None,
    )

# --- Tracked Assets ---

import models

def create_tracked_asset(asset: models.TrackedAssetCreate) -> models.TrackedAsset:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tracked_assets (user_id, name, type, value)
        VALUES (?, ?, ?, ?)
    ''', (asset.user_id, asset.name, asset.type, asset.value))
    conn.commit()
    asset_id = cursor.lastrowid
    conn.close()
    return get_tracked_asset(asset_id)

def get_tracked_assets(user_id: int) -> list:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tracked_assets WHERE user_id = ? ORDER BY id ASC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_tracked_asset(r) for r in rows]

def get_tracked_asset(asset_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tracked_assets WHERE id = ?', (asset_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_tracked_asset(row) if row else None

def update_tracked_asset(asset_id: int, asset: models.TrackedAssetCreate) -> models.TrackedAsset:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE tracked_assets
        SET name = ?, type = ?, value = ?
        WHERE id = ?
    ''', (asset.name, asset.type, asset.value, asset_id))
    conn.commit()
    conn.close()
    return get_tracked_asset(asset_id)

def delete_tracked_asset(asset_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tracked_assets WHERE id = ?', (asset_id,))
    conn.commit()
    conn.close()

def get_total_tracked_assets_value(user_id: int) -> float:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT COALESCE(SUM(value), 0) FROM tracked_assets WHERE user_id = ?', (user_id,))
    total = cursor.fetchone()[0]
    conn.close()
    return total

def _row_to_tracked_asset(row) -> models.TrackedAsset:
    return models.TrackedAsset(
        id=row['id'],
        user_id=row['user_id'],
        name=row['name'],
        type=row['type'],
        value=row['value']
    )


# --- Plaid Connections & Settings ---
from typing import Optional

def save_system_setting(key: str, value: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO system_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    ''', (key, value))
    conn.commit()
    conn.close()

def get_system_setting(key: str) -> Optional[str]:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT value FROM system_settings WHERE key = ?', (key,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None


# --- Category Management ---

def get_categories() -> list:
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM categories ORDER BY name ASC')
    rows = cursor.fetchall()
    conn.close()
    return [{'id': r['id'], 'name': r['name'], 'color': r['color']} for r in rows]

def create_category(name: str, color: Optional[str] = 'muted'):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO categories (name, color)
        VALUES (?, ?)
        ON CONFLICT(name) DO UPDATE SET color = excluded.color
    ''', (name, color))
    conn.commit()
    conn.close()

def delete_category(name: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM categories WHERE name = ?', (name,))
    conn.commit()
    conn.close()


# --- Plaid Items & Accounts ---

def create_plaid_item(user_id: int, access_token: str, item_id: str, institution_name: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO plaid_items (user_id, access_token, item_id, institution_name)
        VALUES (?, ?, ?, ?)
    ''', (user_id, access_token, item_id, institution_name))
    item_row_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return item_row_id

def get_plaid_items(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM plaid_items WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_plaid_item_by_id(item_id: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM plaid_items WHERE item_id = ?', (item_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def update_plaid_item_status(item_id: str, status: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE plaid_items SET status = ? WHERE item_id = ?', (status, item_id))
    conn.commit()
    conn.close()

def delete_plaid_item(user_id: int, item_id: str):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM plaid_items WHERE user_id = ? AND item_id = ?', (user_id, item_id))
    row = cursor.fetchone()
    if row:
        db_item_id = row['id']
        cursor.execute('DELETE FROM plaid_accounts WHERE plaid_item_id = ?', (db_item_id,))
        cursor.execute('DELETE FROM plaid_items WHERE id = ?', (db_item_id,))
        conn.commit()
    conn.close()

def upsert_plaid_account(plaid_item_id: int, account_id: str, name: str, mask: Optional[str], acct_type: str, subtype: Optional[str], balance_available: Optional[float], balance_current: Optional[float], balance_limit: Optional[float]):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO plaid_accounts 
        (plaid_item_id, account_id, name, mask, type, subtype, balance_available, balance_current, balance_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_id) DO UPDATE SET
            name = excluded.name,
            mask = excluded.mask,
            type = excluded.type,
            subtype = excluded.subtype,
            balance_available = excluded.balance_available,
            balance_current = excluded.balance_current,
            balance_limit = excluded.balance_limit
    ''', (plaid_item_id, account_id, name, mask, acct_type, subtype, balance_available, balance_current, balance_limit))
    conn.commit()
    conn.close()

def get_plaid_accounts(user_id: int):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT pa.*, pi.institution_name, pi.item_id 
        FROM plaid_accounts pa
        JOIN plaid_items pi ON pa.plaid_item_id = pi.id
        WHERE pi.user_id = ?
    ''', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows

def create_or_update_transaction_rule(pattern: str, debt_id: Optional[int] = None, category: Optional[str] = None, cursor=None):
    if cursor is not None:
        cursor.execute('''
            INSERT INTO transaction_rules (pattern, debt_id, category)
            VALUES (?, ?, ?)
            ON CONFLICT(pattern) DO UPDATE SET
                debt_id = excluded.debt_id,
                category = excluded.category
        ''', (pattern.strip().lower(), debt_id, category))
    else:
        conn = create_connection()
        c = conn.cursor()
        c.execute('''
            INSERT INTO transaction_rules (pattern, debt_id, category)
            VALUES (?, ?, ?)
            ON CONFLICT(pattern) DO UPDATE SET
                debt_id = excluded.debt_id,
                category = excluded.category
        ''', (pattern.strip().lower(), debt_id, category))
        conn.commit()
        conn.close()

def get_matching_rule(recipient: str):
    conn = create_connection()
    cursor = conn.cursor()
    recipient_lower = recipient.strip().lower()
    cursor.execute('SELECT * FROM transaction_rules')
    rules = cursor.fetchall()
    conn.close()
    
    for r in rules:
        if r['pattern'] in recipient_lower:
            return r
    return None

