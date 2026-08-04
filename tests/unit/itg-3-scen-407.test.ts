import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-407
  test('精度検証実行後、改善提案が複数件生成されるとき、全提案を検証結果に附属', () => {
    const mockRecommendations = [
      {
        recommendationId: 'REC-001',
        rationale: '顧客業種が製造業で、過去同業種の成約率が75%以上の事例が3件以上存在',
        relevanceScore: 0.92,
        isApplicable: true,
      },
      {
        recommendationId: 'REC-002',
        rationale: '商談金額が500万円以上で、提案アプローチ「経営課題解決型」の採用率が88%',
        relevanceScore: 0.87,
        isApplicable: true,
      },
      {
        recommendationId: 'REC-003',
        rationale: '営業担当者の過去フォローアップ成功率が82%で、標準プロセス順守度が95%',
        relevanceScore: 0.78,
        isApplicable: true,
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        recommendations: mockRecommendations,
        overallAccuracyScore: 0.86,
      }),
    };

    const inferenceInput = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerSize: '従業員数: 500人',
      dealAmount: 5500000,
      dealStage: '提案検討',
      salesPersonId: 'SP-001',
    };

    const validationPeriod = {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2024-01-15T23:59:59Z'),
    };

    const result = evaluateInferenceAccuracy(inferenceInput, mockAIEngine, validationPeriod);

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBe(3);

    expect(result.recommendations[0]).toEqual({
      recommendationId: 'REC-001',
      rationale: '顧客業種が製造業で、過去同業種の成約率が75%以上の事例が3件以上存在',
      relevanceScore: 0.92,
      isApplicable: true,
    });

    expect(result.recommendations[1]).toEqual({
      recommendationId: 'REC-002',
      rationale: '商談金額が500万円以上で、提案アプローチ「経営課題解決型」の採用率が88%',
      relevanceScore: 0.87,
      isApplicable: true,
    });

    expect(result.recommendations[2]).toEqual({
      recommendationId: 'REC-003',
      rationale: '営業担当者の過去フォローアップ成功率が82%で、標準プロセス順守度が95%',
      relevanceScore: 0.78,
      isApplicable: true,
    });

    result.recommendations.forEach((rec) => {
      expect(rec.recommendationId).toBeDefined();
      expect(typeof rec.recommendationId).toBe('string');
      expect(rec.rationale).toBeDefined();
      expect(typeof rec.rationale).toBe('string');
      expect(rec.relevanceScore).toBeDefined();
      expect(typeof rec.relevanceScore).toBe('number');
      expect(rec.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(rec.relevanceScore).toBeLessThanOrEqual(1);
      expect(rec.isApplicable).toBeDefined();
      expect(typeof rec.isApplicable).toBe('boolean');
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});