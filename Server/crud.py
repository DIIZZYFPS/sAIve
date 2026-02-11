from database import create_connection
from models import User, UserAsset, Transaction, TransactionCreate

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
        return Transaction(id=row['id'], user_id=row['user_id'], date=row['date'], amount=row['amount'], category=row['category'], type=row['type'])
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
