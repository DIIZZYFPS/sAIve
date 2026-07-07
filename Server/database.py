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

    # Create recurring_transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recurring_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            recipient TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            interval TEXT NOT NULL CHECK(interval IN ('daily', 'weekly', 'monthly', 'yearly')),
            start_date DATE NOT NULL,
            next_date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            date DATETIME NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT 0,
            type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create budgets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, category)
        )
    ''')

    # Create debts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS debts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('auto', 'credit_card', 'student', 'mortgage', 'personal')),
            balance REAL NOT NULL,
            total_amount REAL NOT NULL,
            interest_rate REAL NOT NULL DEFAULT 0.0,
            monthly_payment REAL NOT NULL DEFAULT 0.0,
            start_date DATE,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Migration: add debt_id column to transactions if it doesn't exist yet
    try:
        cursor.execute('ALTER TABLE transactions ADD COLUMN debt_id INTEGER REFERENCES debts(id)')
    except sqlite3.OperationalError as e:
        if "duplicate column name" not in str(e).lower():
            raise
            
    # Create tracked_assets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tracked_assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('real_estate', 'vehicle', 'investment', 'valuable', 'other')),
            value REAL NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Migration: add linked_asset_id column to debts if it doesn't exist yet
    try:
        cursor.execute('ALTER TABLE debts ADD COLUMN linked_asset_id INTEGER REFERENCES tracked_assets(id)')
    except sqlite3.OperationalError as e:
        if "duplicate column name" not in str(e).lower():
            raise

    # Create system_settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    ''')

    # Create categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            color TEXT
        )
    ''')

    # Seed default categories if they don't exist
    cursor.execute('SELECT COUNT(*) FROM categories')
    if cursor.fetchone()[0] == 0:
        default_categories = [
            ('Housing', 'cyan'),
            ('Food', 'orange'),
            ('Transportation', 'blue'),
            ('Subscriptions', 'purple'),
            ('Bills', 'yellow'),
            ('Income', 'income'),
            ('Other', 'muted')
        ]
        cursor.executemany('INSERT INTO categories (name, color) VALUES (?, ?)', default_categories)
        conn.commit()

    # Create plaid_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS plaid_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            access_token TEXT NOT NULL,
            item_id TEXT NOT NULL UNIQUE,
            institution_name TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Create plaid_accounts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS plaid_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plaid_item_id INTEGER NOT NULL,
            account_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            mask TEXT,
            type TEXT NOT NULL,
            subtype TEXT,
            balance_available REAL,
            balance_current REAL,
            balance_limit REAL,
            FOREIGN KEY (plaid_item_id) REFERENCES plaid_items (id)
        )
    ''')

    # Migration: add plaid_transaction_id column to transactions if it doesn't exist yet
    try:
        cursor.execute('ALTER TABLE transactions ADD COLUMN plaid_transaction_id TEXT')
        cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_plaid_txn_id ON transactions(plaid_transaction_id) WHERE plaid_transaction_id IS NOT NULL')
    except sqlite3.OperationalError as e:
        if "duplicate column name" not in str(e).lower():
            raise

    # Create transaction_rules table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transaction_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pattern TEXT UNIQUE NOT NULL,
            debt_id INTEGER,
            category TEXT,
            FOREIGN KEY (debt_id) REFERENCES debts (id) ON DELETE SET NULL
        )
    ''')

    conn.commit()
    conn.close()
