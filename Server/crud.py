from database import create_connection
from models import User, UserAsset, Transaction, TransactionCreate, Budget, BudgetCreate

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

def create_transaction(transaction: TransactionCreate):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO transactions (user_id, date, amount, category, recipient, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        transaction.user_id,
        transaction.date,
        transaction.amount,
        transaction.category,
        transaction.recipient,
        transaction.type
    ))

    conn.commit()
    conn.close()
def get_transaction(transaction_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM transactions WHERE id = ?
    ''', (transaction_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return Transaction(id=row['id'], user_id=row['user_id'], date=row['date'], amount=row['amount'], category=row['category'], type=row['type'], recipient=row['recipient'])
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
        transactions.append(Transaction(id=row['id'], user_id=row['user_id'], date=row['date'], amount=row['amount'], category=row['category'], type=row['type'], recipient=row['recipient']))
    
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
        transactions.append(Transaction(id=row['id'], user_id=row['user_id'], date=row['date'], amount=row['amount'], category=row['category'], type=row['type'], recipient=row['recipient']))
    
    return transactions


def delete_transaction(transaction_id: int):
    conn = create_connection()
    cursor = conn.cursor()

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
