from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
import sys

load_dotenv()  # Load environment variables from .env file

# Read database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL is not set in your .env file.")
    sys.exit(1)

try:
    # Create the SQLAlchemy engine with SSL mode
    engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    print("✅ Database connection established successfully.")

except Exception as e:
    print("❌ Failed to connect to the database:")
    print(e)
    sys.exit(1)
    
print("DATABASE_URL =", os.getenv("DATABASE_URL"))

