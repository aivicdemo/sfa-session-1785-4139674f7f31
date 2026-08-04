import { evaluatePurchaseHistoryQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1510: [edge] 購買履歴データ品質判定機能 - 購買履歴データが昇順に並んでいるとき品質判定に影響しない
  test('購買履歴データが日付昇順に並んでいる場合、品質スコアは正常値を返し、時系列エラーフラグはfalseになる', () => {
    const purchase_history_sorted_asc = [
      { date: '2024-01-01', amount: 1000 },
      { date: '2024-01-15', amount: 2000 },
      { date: '2024-02-01', amount: 1500 }
    ];

    const mock_ai_recommendation_engine = {
      evaluatePatternRelevance: jest.fn(() => 0.85)
    };

    const quality_result = evaluatePurchaseHistoryQuality(
      purchase_history_sorted_asc,
      mock_ai_recommendation_engine
    );

    expect(quality_result.qualityScore).toBeGreaterThanOrEqual(0.8);
    expect(quality_result.isChronologicalError).toBe(false);
    expect(quality_result.dataStructure).toEqual({
      recordCount: 3,
      fieldsPresent: ['date', 'amount']
    });
    expect(quality_result.canUseAsLearningData).toBe(true);
  });
});