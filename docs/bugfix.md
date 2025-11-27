# Bugfixタスクリスト

## 1. /auth/google/callback が 404 を返す問題
- [x] FastAPIの `main.py` に Google OAuth コールバック用エンドポイントを実装する
- [x] 既存の `GoogleOAuthService`／`oauth_config` を利用してトークン交換とユーザー作成/取得を行う
- [x] `tests/integration/api/test_oauth_callback.py` の 5テストが全て通過することを確認する

## 2. /auth/refresh が 404 を返す問題
- [x] FastAPIの `main.py` にリフレッシュトークン更新エンドポイントを実装する
- [x] `create_refresh_token`/`verify_token` を利用し、アクセストークン再発行とバリデーションを行う
- [x] `tests/integration/api/test_refresh_endpoint.py` の 5テストが全て通過することを確認する

## 3. 既存メール重複時のHTTPステータスが400になる問題
- [x] `POST /api/register` のエラーハンドリングを見直し、重複時は 409 Conflict を返す
- [x] 失敗理由を `{"detail": {"error": ...}}` 形式で返す既存仕様を保持する
- [x] `tests/integration/api/test_registration_endpoint.py::test_register_user_with_duplicate_email` を通過させる

## 4. フロントエンド警告・Jest実行環境
- [x] `DashboardPage` の `setUser` / `setLoading` 呼び出しを `act()` 相当でラップできるようテストを調整する
- [x] `.next/standalone/package.json` との名称衝突を解消する（Jest設定またはビルド生成物の除外）
- [x] `npm audit fix --force` 等で報告されている critical vulnerability を解消する

## 5. QA完了条件
- [x] `docker-compose exec -T backend pytest tests/ -v --tb=short` がオールグリーンになること
- [x] `docker-compose exec -T frontend npm test -- --runInBand` が警告なしで完走すること
- [x] `docs/test-report.md` をアップデートし、ベースラインとの差分と結果を記録する

---

**完了日時**: 2025-11-27 17:05 JST  
**PR**: #10 (https://github.com/shkonno/login-auth-by-tdd/pull/10)  
**ブランチ**: `fix/implement-missing-endpoints-and-bugs`
