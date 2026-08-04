import { evaluateRecommendationReasoningScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 推奨妥当性スコア算出機能', () => {
  // SCEN-1640
  test('[normal] 購買履歴の発生日時が新しい順に並ぶ場合、スコアが正しく算出される', () => {
    // Arrange: 購買履歴データセットの準備
    const purchase_records = [
      {
        purchase_id: 'P001',
        purchase_date: '2026-01-15T10:00:00Z',
        amount: 150000,
      },
      {
        purchase_id: 'P002',
        purchase_date: '2026-01-10T14:30:00Z',
        amount: 120000,
      },
      {
        purchase_id: 'P003',
        purchase_date: '2026-01-05T09:15:00Z',
        amount: 90000,
      },
    ];

    const customer_info = {
      customer_id: 'CUST001',
      company_name: 'Test Company Inc.',
      industry: 'Technology',
      employee_count: 500,
    };

    // AIRecommendationEngineのスタブを構成
    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn((record: typeof purchase_records[0]) => {
        const date_str = record.purchase_date;
        if (date_str === '2026-01-15T10:00:00Z') {
          return 0.95; // 最新購買
        } else if (date_str === '2026-01-10T14:30:00Z') {
          return 0.75; // 中間購買
        } else if (date_str === '2026-01-05T09:15:00Z') {
          return 0.55; // 最古購買
        }
        return 0.0;
      }),
    };

    // Act: 推奨妥当性スコア算出機能を呼び出し
    const result_score = evaluateRecommendationReasoningScore(
      purchase_records,
      customer_info,
      ai_engine_stub
    );

    // Assert: 計算式の検証
    // 期待値: (0.95 × 0.5) + (0.75 × 0.3) + (0.55 × 0.2)
    //       = 0.475 + 0.225 + 0.11
    //       = 0.81
    expect(result_score).toBeGreaterThanOrEqual(0.80);
    expect(result_score).toBeLessThanOrEqual(0.85);
    expect(result_score).toBeCloseTo(0.81, 2);

    // 重み係数が正しく適用されていることを確認
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenNthCalledWith(1, purchase_records[0]);
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenNthCalledWith(2, purchase_records[1]);
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenNthCalledWith(3, purchase_records[2]);
  });
});