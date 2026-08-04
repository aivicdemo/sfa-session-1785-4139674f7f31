import { evaluateInferencePrecision } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-382
  test('推論精度検証機能 - 検証対象の推奨履歴が1件のとき、精度計測が単一レコード基準で実行される', () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((record) => {
        return {
          score: 0.85,
          applicableConditions: ['budget >= 5000000', 'industry == consulting'],
        };
      }),
    };

    const singleRecommendationRecord = {
      recommendationId: 'REC-001',
      customerId: 'C001',
      dealCondition: '予算500万円以上',
      recommendedApproach: 'コンサル型提案',
      actualResult: '成約',
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const result = evaluateInferencePrecision([singleRecommendationRecord], mockRecommendationEngine);

    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(singleRecommendationRecord);

    expect(result.measurementMode).toBe('singleRecord');
    expect(result.precision).toBe(1.0);
    expect(result.recall).toBe('N/A');
    expect(result.f1Score).toBe('N/A');
    expect(result.evaluatedRecordCount).toBe(1);
    expect(Array.isArray(result.evaluatedRecords)).toBe(true);
    expect(result.evaluatedRecords.length).toBe(1);
    expect(result.evaluatedRecords[0].recommendationId).toBe('REC-001');
  });
});