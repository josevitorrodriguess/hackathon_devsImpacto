# 🐘 Configurando PostgreSQL + Alembic no FastAPI

Guia completo para conectar o projeto a um **banco PostgreSQL** com **SQLAlchemy + Alembic (migrações)**.

---

## 1️⃣ Instalar dependências

```bash
pip install sqlalchemy alembic psycopg[binary] python-dotenv
```

---

## 2️⃣ Criar `.env`

```env
DATABASE_URL=postgresql+psycopg://app:app@localhost:5432/appdb
```

---

## 3️⃣ Configurar o Banco

**`app/db.py`**

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, future=True, echo=False)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 4️⃣ Criar Models ORM

**`app/models/item.py`**

```python
from sqlalchemy import String, Integer, Boolean, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10,2), default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
```

---

## 5️⃣ Criar Schemas (Pydantic)

**`app/schemas/item.py`**

```python
from pydantic import BaseModel, Field
from typing import Optional

class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(ge=0)

class ItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    is_active: bool

    class Config:
        from_attributes = True
```

---

## 6️⃣ Criar Controller

**`app/controllers/items.py`**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemOut

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    item = Item(name=payload.name, description=payload.description, price=payload.price)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/", response_model=list[ItemOut])
def list_items(db: Session = Depends(get_db)):
    items = db.execute(select(Item)).scalars().all()
    return items
```

---

## 7️⃣ Configurar Alembic

```bash
alembic init alembic
```

### Editar `alembic/env.py`

```python
from logging.config import fileConfig
import os
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context

load_dotenv()
config = context.config
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

from app.db import Base
from app import models
target_metadata = Base.metadata
```

---

## 8️⃣ Criar e Rodar Migração

```bash
alembic revision --autogenerate -m "create items table"
alembic upgrade head
```

---

## 9️⃣ Testar

```bash
uvicorn app.main:app --reload
```

Acesse:
- http://127.0.0.1:8000/docs  
- http://127.0.0.1:8000/api/v1/items/

---

## 🔁 Quando mudar o modelo

Sempre que alterar o modelo ORM (`app/models/*.py`):

```bash
alembic revision --autogenerate -m "update <tabela>"
alembic upgrade head
```

---

## 🧠 Dicas

- Para usar UUIDs no lugar de `id`:
  ```python
  import uuid
  from sqlalchemy.dialects.postgresql import UUID
  id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
  ```
- Ative logs SQL para debug: `create_engine(..., echo=True)`
- Para resetar o banco: `alembic downgrade base && alembic upgrade head`

---

✨ Agora você tem migrações automatizadas e conexão com o Postgres 100% integrada ao seu backend FastAPI!
