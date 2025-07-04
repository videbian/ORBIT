"""
Configuração do banco de dados PostgreSQL
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# URL do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://orbit:orbit@localhost:5432/orbit")

# Criar engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Criar SessionLocal para transações
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

def get_db():
    """
    Dependency para obter sessão do banco de dados
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Criar todas as tabelas no banco de dados
    """
    from models import Base
    Base.metadata.create_all(bind=engine)

