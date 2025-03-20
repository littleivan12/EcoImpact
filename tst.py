from database_ben import SessionLocal, engine  # Import from database_ben

# Create a session
session = SessionLocal()

# Test the connection
try:
    with engine.connect() as conn:
        print("✅ Successfully connected to MySQL!")
except Exception as e:
    print("❌ Connection failed:", str(e))