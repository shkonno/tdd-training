/**ダッシュボードページのテスト
 * 
 * t_wada形式のTDDで進めます。
 * 1. Red: 失敗するテストを書く
 * 2. Green: 最小限の実装でテストを通す
 * 3. Refactor: コードをきれいにする
 */

import { render, screen, waitFor, act } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ダッシュボードページが表示される', async () => {
    // トークンがあることをモック
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('test-token-123'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    
    // API成功レスポンスをモック
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: '123',
        email: 'test@example.com'
      })
    })

    await act(async () => {
      render(<DashboardPage />)
    })
    
    // ページタイトルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /ダッシュボード/i })).toBeInTheDocument()
    })
  })

  it('ユーザー情報が表示される', async () => {
    // トークンがあることをモック
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('test-token-123'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    
    const testUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com'
    }
    
    // API成功レスポンスをモック
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => testUser
    })

    await act(async () => {
      render(<DashboardPage />)
    })
    
    // ユーザー情報が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(new RegExp(testUser.email))).toBeInTheDocument()
    })
    
    // APIが正しく呼ばれることを確認
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/users/me',
      expect.objectContaining({
        headers: {
          'Authorization': 'Bearer test-token-123'
        }
      })
    )
  })

  it('トークンがない場合、エラーメッセージが表示される', async () => {
    // トークンがないことをモック
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    
    await act(async () => {
      render(<DashboardPage />)
    })
    
    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/ログインが必要です/i)).toBeInTheDocument()
    })
  })

  it('APIエラーの場合、エラーメッセージが表示される', async () => {
    // トークンがあることをモック
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('test-token-123'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    
    // API 401エラーレスポンスをモック
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        detail: { error: 'Invalid or expired token' }
      })
    })

    await act(async () => {
      render(<DashboardPage />)
    })
    
    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText(/認証に失敗しました/i)).toBeInTheDocument()
    })
  })
})

