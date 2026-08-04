import { classifyErrorsByCategory } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - エラーカテゴリ別分類機能', () => {
  // SCEN-449
  test('複数種類のエラーカテゴリを含む不整合ログが全カテゴリに正しく分類される', () => {
    const inconsistency_log_text = 'APIレスポンスタイムアウトが発生しました。データベース接続エラーにより処理が中断。認証トークン無効でリトライに失敗。';

    const result = classifyErrorsByCategory(inconsistency_log_text);

    expect(result).toEqual({
      classified_errors: [
        {
          category: 'APIレスポンスタイムアウト',
          count: 1,
        },
        {
          category: 'データベース接続エラー',
          count: 1,
        },
        {
          category: '認証トークン無効',
          count: 1,
        },
      ],
      total_categories: 3,
    });

    const categorized_summary = result.classified_errors.reduce(
      (acc, error) => ({
        ...acc,
        [error.category]: error.count,
      }),
      {} as Record<string, number>
    );

    expect(categorized_summary).toHaveProperty('APIレスポンスタイムアウト', 1);
    expect(categorized_summary).toHaveProperty('データベース接続エラー', 1);
    expect(categorized_summary).toHaveProperty('認証トークン無効', 1);
    expect(Object.keys(categorized_summary).length).toBe(3);
  });
});