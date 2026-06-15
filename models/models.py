from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from typing import Optional
from flask_login import UserMixin


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    name: Mapped[Optional[str]] = mapped_column(db.String(100))
    email: Mapped[Optional[str]] = mapped_column(db.String(100), unique=True)
    password_hash: Mapped[Optional[str]] = mapped_column(db.String(255))
    phone: Mapped[Optional[str]] = mapped_column(db.String(20))
    location: Mapped[Optional[str]] = mapped_column(db.String(150))
    display_pic: Mapped[Optional[bytes]] = mapped_column(db.LargeBinary, nullable=True, default=None)
    mimetype: Mapped[Optional[str]] = mapped_column(db.String(100), nullable=True, default=None)
    products: Mapped[list["Product"]] = relationship("Product", back_populates="user", cascade="all, delete-orphan")


class Product(db.Model):
    __tablename__ = 'products'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('users.id'))
    name: Mapped[Optional[str]] = mapped_column(db.String(150))
    description: Mapped[Optional[str]] = mapped_column(db.Text)
    price: Mapped[Optional[float]] = mapped_column(db.Numeric(10, 2))
    img: Mapped[Optional[bytes]] = mapped_column(db.LargeBinary)  # Stores the image data
    mimetype: Mapped[Optional[str]] = mapped_column(db.String(100))  # Stores the MIME type
    ai_score: Mapped[Optional[float]] = mapped_column(db.Float, default=0.0)
    eco_score: Mapped[Optional[float]] = mapped_column(db.Float, default=0.0)
    user: Mapped["User"] = relationship(back_populates="products")
