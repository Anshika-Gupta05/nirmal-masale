from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# 1. Products Table (Already exists)
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    category = Column(String(100))
    slug = Column(String(255), unique=True, index=True)
    image_url = Column(String(255))
    weight = Column(String(50))
    price = Column(Float)
    description = Column(String(500), nullable=True)

# 2. Orders Table (NEW)
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True) # e.g., NRM-10293
    customer_first_name = Column(String(100))
    customer_last_name = Column(String(100))
    address = Column(String(500))
    total_amount = Column(Float)
    status = Column(String(50), default="Pending") # Pending, Shipped, Delivered
    created_at = Column(DateTime, default=datetime.utcnow)

    # Link to the items in this order
    items = relationship("OrderItem", back_populates="order")

# 3. Order Items Table (NEW - stores what spices they bought)
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_name = Column(String(255))
    weight = Column(String(50))
    quantity = Column(Integer)
    price = Column(Float)

    # Link back to the main order
    order = relationship("Order", back_populates="items")