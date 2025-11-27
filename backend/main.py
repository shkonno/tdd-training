from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.domain.jwt import verify_token, create_access_token

app = FastAPI(
    title="Auth TDD Learning",
    description="JWT認証をTDDで学ぶプロジェクト",
    version="0.1.0"
)


@app.get("/")
def root():
    return {"message": "Auth API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


class RefreshTokenRequest(BaseModel):
    refresh_token: str


@app.post("/auth/refresh")
def refresh_access_token(request: RefreshTokenRequest):
    """リフレッシュトークンを使って新しいアクセストークンを取得する"""
    try:
        # リフレッシュトークンを検証
        payload = verify_token(request.refresh_token)
        
        # type: "refresh" であることを確認
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type. Refresh token required."
            )
        
        # 新しいアクセストークンを生成
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload."
            )
        
        new_access_token = create_access_token({"sub": user_id})
        
        return {"access_token": new_access_token}
    
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        # 期限切れや無効なトークンの場合
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )
