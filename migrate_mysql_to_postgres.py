import pandas as pd
from sqlalchemy import create_engine

# MySQL connection
mysql_engine = create_engine("mysql+pymysql://root:@localhost:3306/ecoimpact")

# PostgreSQL connection
postgres_engine = create_engine("postgresql://postgres:@localhost:5432/ecoimpact")

# List of tables to migrate
tables = ["air_super", "object_degradation", "pollution_type", "Plastic_Waste_Data", "companies"]

for table in tables:
    print(f"📦 Migrating: {table}...")

    # Read from MySQL
    df = pd.read_sql_table(table, con=mysql_engine)

    # Write to PostgreSQL
    df.to_sql(table, con=postgres_engine, index=False, if_exists='replace')  # or 'append' if needed

    print(f"✅ Done: {table}")