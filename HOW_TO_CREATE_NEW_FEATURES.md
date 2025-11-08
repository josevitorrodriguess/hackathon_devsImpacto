# 🧩 Como Criar Novas Funcionalidades (MVC no FastAPI)

Este guia explica como **adicionar novas partes** ao backend FastAPI seguindo o padrão **MVC simplificado** usado neste projeto.

---

## 🗂 Estrutura Base

```
app/
  main.py
  models/
    item.py
  controllers/
    items.py
  views/
```

- **Model (M):** estrutura de dados e validação (com `pydantic.BaseModel`).
- **Controller (C):** rotas e lógica da aplicação (usando `APIRouter`).
- **View (V):** resposta (JSON ou HTML) — aqui usamos apenas JSON.

---

## 🧱 1. Criar um novo Model

Exemplo: adicionar um modelo para **Usuário**.

```bash
touch app/models/user.py
```

Conteúdo:

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    age: Optional[int] = Field(default=None, ge=0)

class UserOut(UserIn):
    id: int
```

> 💡 **Dica:**  
> `UserIn` representa dados de entrada (POST/PATCH).  
> `UserOut` é a resposta que a API retorna (inclui `id`).

---

## 🧠 2. Criar o Controller

Crie o arquivo:

```bash
touch app/controllers/users.py
```

Conteúdo:

```python
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.user import UserIn, UserOut

router = APIRouter(prefix="/users", tags=["users"])

_DB: list[UserOut] = []
_next_id = 1

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserIn) -> UserOut:
    global _next_id
    user = UserOut(id=_next_id, **payload.model_dump())
    _DB.append(user)
    _next_id += 1
    return user

@router.get("/", response_model=List[UserOut])
def list_users() -> list[UserOut]:
    return _DB

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int) -> UserOut:
    for u in _DB:
        if u.id == user_id:
            return u
    raise HTTPException(status_code=404, detail="User not found")
```

---

## ⚙️ 3. Registrar o Controller no `main.py`

Abra `app/main.py` e adicione:

```python
from app.controllers.users import router as users_router

# abaixo do include_router de items
app.include_router(users_router, prefix="/api/v1")
```

---

## 🧪 4. Testar o Novo Endpoint

Rode o servidor:

```bash
uvicorn app.main:app --reload
```

Abra no navegador ou via cURL:

```bash
# Criar um usuário
curl -X POST http://127.0.0.1:8000/api/v1/users/   -H "Content-Type: application/json"   -d '{"name":"Sarah","email":"sarah@exemplo.com","age":22}'

# Listar usuários
curl http://127.0.0.1:8000/api/v1/users/
```

---

## 🚀 5. Criar Outros Recursos

Repita o mesmo processo para novos tipos de dados, por exemplo:

| Recurso | Model File           | Controller File            | Rota Base |
|----------|----------------------|-----------------------------|------------|
| Produtos | `app/models/product.py` | `app/controllers/products.py` | `/api/v1/products` |
| Alunos   | `app/models/student.py` | `app/controllers/students.py` | `/api/v1/students` |

---

## 💡 Boas Práticas

- Use nomes **no plural** para controladores (ex.: `users`, `items`).
- Valide dados com `pydantic.Field()` (ex.: limites, tipos, padrões).
- Separe **entrada** (`ModelIn`) e **saída** (`ModelOut`).
- Quando precisar persistência real, troque a lista `_DB` por um banco (SQLite, Postgres etc).

---

## 🧰 Comandos Úteis

| Ação | Comando |
|------|----------|
| Rodar servidor | `uvicorn app.main:app --reload` |
| Instalar dependências | `pip install fastapi uvicorn pydantic` |
| Formatar código (opcional) | `black .` |
| Rodar testes (quando houver) | `pytest` |

---

✳️ Pronto! Agora você sabe criar **novos modelos e controladores** seguindo o padrão MVC leve deste projeto.
