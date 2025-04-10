from sqlalchemy import Column, Integer, String, Float
from database import Base

class AirSuper(Base):
    __tablename__ = "air_super"

    country = Column(String(255))
    country_code = Column(String(255))
    year = Column(Integer, primary_key=True)
    total = Column(Float, nullable=False)
    coal = Column(Float, nullable=False)
    oil = Column(Float, nullable=False)
    gas = Column(Float, nullable=False)
    cement = Column(Float, nullable=False)
    flaring = Column(Float, nullable=False)
    other = Column(Float, nullable=False)
    per_capita = Column(Float, nullable=False)
    number_code = Column(Integer, nullable=False)
class ObjectDegradation(Base):
    __tablename__ = "object_degradation"

    object_id = Column(Integer, primary_key=True)
    object_name = Column(String(255))
    obejct_type = Column(String(255))  # Fixed typo
    time_period = Column(Integer, nullable=False)

class PollutionType(Base):
    __tablename__ = "pollution_type"  # Fixed table name typo

    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(225))
    url = Column(String(255))

class PlasticWasteData(Base):
    __tablename__ = "plastic_waste_data"

    Country = Column(String(100), nullable=False)
    Total_Waste = Column(Float, nullable=False)
    Main_Sources = Column(String(255), nullable=False)
    Recycling_Rate = Column(Float, nullable=False)
    Per_Capita_Waste_KG = Column(Float, nullable=False)
    Coastal_Waste_Risk = Column(String(100), nullable=False)
    Country_Code = Column(String(3), nullable=False, primary_key=True)  # Kept as primary key
