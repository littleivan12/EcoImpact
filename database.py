from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#DATABASE_URL = "postgresql://ivancandelero:@localhost:5432/ecoimpact"  # Corrected PostgreSQL URL
DATABASE_URL = "postgresql://postgres:hivemind@localhost:5432/ecoimpact"  

engine = create_engine(DATABASE_URL)  # Removed `connect_args`
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
