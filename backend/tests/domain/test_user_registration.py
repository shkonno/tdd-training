"""Userドメインエンティティのテスト"""

from app.domain.user import User


def test_create_user_with_valid_attributes():
    """有効な属性でUserエンティティを作成できる"""
    user = User(
        email="test@example.com",
        hashed_password="hashed_password_here"
    )

    assert user.email == "test@example.com"
    assert user.hashed_password == "hashed_password_here"
    assert user.id is not None  # UUIDが自動生成される
    assert user.is_active is True  # デフォルト値
    assert user.created_at is not None  # 自動設定される
