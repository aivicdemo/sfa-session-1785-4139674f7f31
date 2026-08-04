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

    expect(result.categoryAggregations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'API_TIMEOUT',
          count: 2,
          errors: expect.arrayContaining([
            expect.objectContaining({
              errorId: 'ERR001',
              errorMessage: '推奨生成タイムアウト',
              category: 'API_TIMEOUT',
            }),
            expect.objectContaining({
              errorId: 'ERR002',
              errorMessage: 'APIレート制限超過',
              category: 'API_TIMEOUT',
            }),
          ]),
        }),
        expect.objectContaining({
          category: 'AUTH_ERROR',
          count: 3,
          errors: expect.arrayContaining([
            expect.objectContaining({
              errorId: 'ERR003',
              errorMessage: '不正なAPIキー',
              category: 'AUTH_ERROR',
            }),
            expect.objectContaining({
              errorId: 'ERR004',
              errorMessage: '認証トークン期限切れ',
              category: 'AUTH_ERROR',
            }),
            expect.objectContaining({
              errorId: 'ERR005',
              errorMessage: '認証トークン期限切れ',
              category: 'AUTH_ERROR',
            }),
          ]),
        }),
      ])
    );

    expect(result.totalCount).toBe(5);
    expect(result.categoryAggregations).toHaveLength(2);
  });
});