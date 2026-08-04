import { evaluateDataQualityForPurchaseHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1457: 同じ購買履歴データで2回実行して同じ品質スコアと不適合項目が返される', () => {
    // テスト用の購買履歴データセット
    const purchaseHistoryData = {
      customerId: 'CUST-20240115-001',
      purchaseRecords: [
        {
          categoryId: 'CAT-001',
          amount: 50000,
          purchaseDate: '2024-01-10T09:30:00Z'
        },
        {
          categoryId: 'CAT-002',
          amount: 75000,
          purchaseDate: '2024-01-15T14:15:00Z'
        }
      ]
    };

    // AIRecommendationEngineのスタブを設定
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        similarPatterns: [
          {
            patternId: 'PATTERN-001',
            matchScore: 0.92,
            historicalOutcome: 'success'
          }
        ],
        totalMatches: 1
      })
    };

    // 1回目の実行
    const result1 = evaluateDataQualityForPurchaseHistory(
      purchaseHistoryData,
      mockAIRecommendationEngine
    );
    const qualityScore1 = result1.qualityScore;
    const nonConformingItems1 = result1.nonConformingItems;

    // 2回目の実行
    const result2 = evaluateDataQualityForPurchaseHistory(
      purchaseHistoryData,
      mockAIRecommendationEngine
    );
    const qualityScore2 = result2.qualityScore;
    const nonConformingItems2 = result2.nonConformingItems;

    // 品質スコアの比較（小数第3位まで）
    expect(Math.round(qualityScore1 * 1000) / 1000).toBe(
      Math.round(qualityScore2 * 1000) / 1000
    );

    // 不適合項目の内容と順序が完全に一致することを確認
    expect(nonConformingItems1).toEqual(nonConformingItems2);
    expect(nonConformingItems1.length).toBe(nonConformingItems2.length);

    // 具体値の検証（品質スコアが0～100の範囲）
    expect(qualityScore1).toBeGreaterThanOrEqual(0);
    expect(qualityScore1).toBeLessThanOrEqual(100);
    expect(qualityScore2).toBeGreaterThanOrEqual(0);
    expect(qualityScore2).toBeLessThanOrEqual(100);

    // 不適合項目が配列であることを確認
    expect(Array.isArray(nonConformingItems1)).toBe(true);
    expect(Array.isArray(nonConformingItems2)).toBe(true);
  });
});