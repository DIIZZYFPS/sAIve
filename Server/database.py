import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).parent.resolve() / "database.db"

def create_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn  

def create_tables():
    conn = create_connection()
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            net_worth REAL NOT NULL
        )
    ''')

    # Create user_assets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            year YEAR NOT NULL,
            month INTEGER NOT NULL,
            TIncome REAL NOT NULL,
            TExpense REAL NOT NULL,
            TSavings REAL NOT NULL,
            NetWorth REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date DATE NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            recipient TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()