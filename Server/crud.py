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
        INSERT INTO user_assets (user_id, year, month, TIncome, TExpense, TSavings)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_asset.user_id, user_asset.year, user_asset.month, user_asset.TIncome, user_asset.TExpense, user_asset.TSavings))

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
        return UserAsset(id=row['id'], user_id=row['user_id'], year=row['year'], month=row['month'], TIncome=row['TIncome'], TExpense=row['TExpense'], TSavings=row['TSavings'])
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
        SET user_id = ?, year = ?, month = ?, TIncome = ?, TExpense = ?, TSavings = ?
        WHERE id = ?
    ''', (user_asset.user_id, user_asset.year, user_asset.month, user_asset.TIncome, user_asset.TExpense, user_asset.TSavings, user_asset.id))

    conn.commit()
    conn.close()
    return user_asset
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
    ''')

    rows = cursor.fetchall()
    conn.close()

    transactions = []
    for row in rows:
        transactions.append(Transaction(id=row['id'], user_id=row['user_id'], date=row['date'], amount=row['amount'], category=row['category'], type=row['type'], recipient=row['recipient']))
    
    return transactions