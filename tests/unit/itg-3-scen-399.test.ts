import { sortRecommendationsByDatetime, calculateAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-399
  test('推奨履歴データが逆順で到着したとき、日時順ソート後に精度計測を実行する', () => {
    // 準備: テスト用の推奨履歴データセットを作成（生成日時が新しい順に配列に格納）
    const unsortedRecommendations = [
      {
        id: 'rec_001',
        generatedAt: '2026-01-15T10:30:00Z',
        recommendationContent: '提案方式X',
        successFlag: true,
      },
      {
        id: 'rec_002',
        generatedAt: '2026-01-10T14:20:00Z',
        recommendationContent: '提案方式Y',
        successFlag: true,
      },
      {
        id: 'rec_003',
        generatedAt: '2026-01-05T09:15:00Z',
        recommendationContent: '提案方式Z',
        successFlag: false,
      },
    ];

    // 実行: ソート処理を実行
    const sortedRecommendations = sortRecommendationsByDatetime(unsortedRecommendations);

    // 検証: ソート後の配列が生成日時の古い順（昇順）に整列されていること
    expect(sortedRecommendations[0].generatedAt).toBe('2026-01-05T09:15:00Z');
    expect(sortedRecommendations[0].recommendationContent).toBe('提案方式Z');
    expect(sortedRecommendations[1].generatedAt).toBe('2026-01-10T14:20:00Z');
    expect(sortedRecommendations[1].recommendationContent).toBe('提案方式Y');
    expect(sortedRecommendations[2].generatedAt).toBe('2026-01-15T10:30:00Z');
    expect(sortedRecommendations[2].recommendationContent).toBe('提案方式X');

    // 実行: 精度計測処理を実行
    const accuracyMetrics = calculateAccuracy(sortedRecommendations);

    // 検証: 計測結果のメトリクス値を検証
    // 成功フラグが true のレコード: 2件
    // 精度スコア = 2/3 ≈ 0.667
    expect(accuracyMetrics.totalRecords).toBe(3);
    expect(accuracyMetrics.successCount).toBe(2);
    expect(accuracyMetrics.accuracy).toBeCloseTo(0.667, 2);
  });
});