"""JWT生成・検証機能"""

from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt

SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """アクセストークンを生成する"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """トークンを検証してペイロードを返す"""
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload
