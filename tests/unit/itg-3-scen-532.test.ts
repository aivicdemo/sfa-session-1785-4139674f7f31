import { calculateImprovementPriorityRank } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-532: [edge] 改善優先度ランク算出機能 - 修正リソースコストが欠落しているときランク算出が失敗する
  test('修正リソースコストが欠落している場合、MISSING_REQUIRED_FIELD_RESOURCE_COST エラーを返す', () => {
    const dealId = 'DEAL-20240115-001';
    const customerId = 'CUST-99999';
    const improvementInitiatives = [
      {
        initiativeId: 'INIT-001',
        initiativeName: '提案資料の自動生成機能',
        expectedBenefit: 15,
        implementationComplexity: 3,
        resourceCost: null,
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        isRelevant: false,
        reason: 'リソースコストが欠落しているため評価不可',
      }),
    };

    const result = calculateImprovementPriorityRank(
      {
        dealId,
        customerId,
        improvementInitiatives,
      },
      mockAIEngine
    );

    expect(result.status).toBe('failure');
    expect(result.errorCode).toBe('MISSING_REQUIRED_FIELD_RESOURCE_COST');
    expect(result.message).toContain('修正リソースコスト（修正にかかる工数・費用）が指定されていません');
    expect(result.priorityRank).toBeUndefined();
  });
});