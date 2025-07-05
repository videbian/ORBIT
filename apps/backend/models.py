"""
Modelos do banco de dados para ORBIT IA
"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    """Modelo de usuário do sistema"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, client, partner, backoffice
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"


class Document(Base):
    """Modelo de documento processado pela IA Wu3"""
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, index=True)  # UUID
    user_id = Column(Integer, nullable=False)  # FK para users
    document_type = Column(String, nullable=False)  # contract, invoice, etc.
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    extracted_data = Column(String, nullable=True)  # JSON como string
    confidence_score = Column(String, nullable=True)  # Float como string
    status = Column(String, default='processing')  # processing, complete, error
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Document(id='{self.id}', filename='{self.original_filename}', status='{self.status}')>"

