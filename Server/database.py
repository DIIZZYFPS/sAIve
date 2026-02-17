import sqlite3
import sys
import os
import shutil
from pathlib import Path

# Determine the intended persistent storage location
# Electron should pass SAIVE_USER_DATA environment variable
user_data_dir = os.environ.get("SAIVE_USER_DATA")

if user_data_dir:
    # Production/Installed mode with persistent storage
    base_dir = Path(user_data_dir)
    base_dir.mkdir(parents=True, exist_ok=True) # Ensure directory exists
    DATABASE_PATH = base_dir / "database.db"
    
    # Check for legacy database migration
    if getattr(sys, 'frozen', False):
        legacy_path = Path(sys.executable).parent / "database.db"
        if legacy_path.exists() and not DATABASE_PATH.exists():
            try:
                print(f"Migrating database from {legacy_path} to {DATABASE_PATH}")
                shutil.copy2(legacy_path, DATABASE_PATH)
            except Exception as e:
                print(f"Failed to migrate database: {e}")
                
elif getattr(sys, 'frozen', False):
    # Fallback for frozen app if env var is missing (shouldn't happen if Electron configured correctly)
    DATABASE_PATH = Path(sys.executable).parent / "database.db"
else:
    # Running in development
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

    # add first user if not exists
    cursor.execute('SELECT COUNT(*) FROM users')
    count = cursor.fetchone()[0]
    if count == 0:
        cursor.execute('INSERT INTO users (name, net_worth) VALUES (?, ?)', ('Default User', 0.0))
    conn.commit()

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