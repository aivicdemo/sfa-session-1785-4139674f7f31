import { measureRecommendationAccuracy } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-334
  test('推奨根拠が存在する商談について、根拠情報が精度計測に正常に参照される', () => {
    const dealId = 'DEAL-TEST-334';
    const reasonId = 'REASON-001';
    const referencedPatternsCount = 3;
    const confidenceScore = 0.92;
    const accuracyScore = 0.88;
    const timestamp = new Date('2024-01-15T11:00:00Z');

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        dealId: dealId,
        proposedApproach: 'テスト提案アプローチ',
        reasoning: {
          reasonId: reasonId,
          reasonType: '過去成功事例',
          relatedCases: 3,
          confidenceScore: confidenceScore,
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE-001',
          similarity: 0.95,
          metadata: { industry: '製造業', dealSize: 5000000 },
        },
        {
          caseId: 'CASE-002',
          similarity: 0.91,
          metadata: { industry: '製造業', dealSize: 5200000 },
        },
        {
          caseId: 'CASE-003',
          similarity: 0.88,
          metadata: { industry: '製造業', dealSize: 4800000 },
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.88,
      }),
    };

    const mockPatternMaster = {
      getReasonMetadata: jest.fn().mockReturnValue({
        reasonId: reasonId,
        reasonType: '過去成功事例',
        relatedCases: [
          { caseId: 'CASE-001', successMetrics: { adoptionRate: 0.95 } },
          { caseId: 'CASE-002', successMetrics: { adoptionRate: 0.91 } },
          { caseId: 'CASE-003', successMetrics: { adoptionRate: 0.88 } },
        ],
      }),
    };

    const dealData = {
      dealId: dealId,
      customerName: 'テスト顧客A',
      industry: '製造業',
      dealSize: 5000000,
      recommendation: {
        reasonId: reasonId,
      },
    };

    const result = measureRecommendationAccuracy(
      dealData,
      mockRecommendationEngine,
      mockPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.dealId).toBe('DEAL-TEST-334');
    expect(result.reasonId).toBe('REASON-001');
    expect(result.referencedPatternsCount).toBe(3);
    expect(result.confidenceScore).toBe(0.92);
    expect(result.accuracyScore).toBe(0.88);
    expect(result.status).toBe('SUCCESS');
    expect(result.measurementId).toBeDefined();
    expect(typeof result.measurementId).toBe('string');
    expect(result.timestamp).toBeDefined();
  });
});