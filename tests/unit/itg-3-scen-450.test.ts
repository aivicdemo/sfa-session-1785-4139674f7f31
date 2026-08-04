import { classifyErrorsByCategory } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - エラーカテゴリ別分類機能', () => {
  // SCEN-450
  test('複数のエラーが同一カテゴリに属する場合、カテゴリごとに件数が集計される', () => {
    const errors = [
      {
        errorId: 'ERR001',
        errorMessage: '推奨生成タイムアウト',
        category: 'API_TIMEOUT',
      },
      {
        errorId: 'ERR002',
        errorMessage: 'APIレート制限超過',
        category: 'API_TIMEOUT',
      },
      {
        errorId: 'ERR003',
        errorMessage: '不正なAPIキー',
        category: 'AUTH_ERROR',
      },
      {
        errorId: 'ERR004',
        errorMessage: '認証トークン期限切れ',
        category: 'AUTH_ERROR',
      },
      {
        errorId: 'ERR005',
        errorMessage: '認証トークン期限切れ',
        category: 'AUTH_ERROR',
      },
    ];

    const result = classifyErrorsByCategory(errors);

    expect(result).toEqual({
      categories: {
        API_TIMEOUT: {
          count: 2,
          errors: [
            {
              errorId: 'ERR001',
              errorMessage: '推奨生成タイムアウト',
              category: 'API_TIMEOUT',
            },
            {
              errorId: 'ERR002',
              errorMessage: 'APIレート制限超過',
              category: 'API_TIMEOUT',
            },
          ],
        },
        AUTH_ERROR: {
          count: 3,
          errors: [
            {
              errorId: 'ERR003',
              errorMessage: '不正なAPIキー',
              category: 'AUTH_ERROR',
            },
            {
              errorId: 'ERR004',
              errorMessage: '認証トークン期限切れ',
              category: 'AUTH_ERROR',
            },
            {
              errorId: 'ERR005',
              errorMessage: '認証トークン期限切れ',
              category: 'AUTH_ERROR',
            },
          ],
        },
      },
      totalCount: 5,
    });
  });
});