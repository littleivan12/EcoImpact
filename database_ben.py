from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL Connection URL (modify `username`, `password`, and database name if needed)
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/ecoimpact"

# Create Engine for MySQL
engine = create_engine(DATABASE_URL, echo=True)

# Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base Class for Models
Base = declarative_base()