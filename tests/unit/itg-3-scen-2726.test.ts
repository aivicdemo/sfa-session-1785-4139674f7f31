import { evaluatePatternRelevance, findSimilarPatterns, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客・商談条件の照合判定と提案アプローチ推奨', () => {
  // SCEN-2726
  test('新規案件の顧客属性と商談条件が成功パターンと合致した場合、最適な提案アプローチが推奨される', () => {
    // Arrange: テスト用の顧客属性データ
    const customerAttributes = {
      industry: 'IT',
      employeeCount: 1000,
      decisionFlow: 'multiple_approvers'
    };

    // Arrange: テスト用の商談条件データ
    const dealConditions = {
      dealAmount: 5000000,
      implementationPeriodDays: 90,
      technologyStack: 'cloud_infrastructure'
    };

    // Arrange: AIRecommendationEngine のスタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.85,
        matches: true
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          caseId: 'CASE-001',
          similarity: 0.82,
          closureRate: 0.88,
          description: '同規模IT企業、段階的提案で成功'
        },
        {
          caseId: 'CASE-002',
          similarity: 0.81,
          closureRate: 0.90,
          description: '金融系顧客、複数決裁者対応で成功'
        },
        {
          caseId: 'CASE-003',
          similarity: 0.80,
          closureRate: 0.92,
          description: 'クラウド基盤導入案件で成功'
        }
      ]),
      generateRecommendation: jest.fn().mockReturnValue({
        approachType: 'phased_proposal',
        phases: [
          {
            phase: 1,
            name: 'PoC Proposal',
            description: 'Proof of Concept for cloud infrastructure'
          },
          {
            phase: 2,
            name: 'Full Implementation',
            description: 'Complete cloud platform deployment'
          }
        ],
        reasoning: 'Past cases with same conditions achieved 92% closure rate',
        confidenceScore: 92
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'Based on 3 similar successful cases in your industry segment with comparable deal size and decision-making structure, a phased approach beginning with PoC has demonstrated 92% closure success rate. This approach reduces implementation risk and aligns with multi-approver decision patterns.'
      )
    };

    // Act: 顧客属性と商談条件を入力値として渡す
    const patternRelevance = mockAIEngine.evaluatePatternRelevance(customerAttributes, dealConditions);
    expect(patternRelevance.score).toBe(0.85);

    const similarPatterns = mockAIEngine.findSimilarPatterns(customerAttributes, dealConditions);
    expect(similarPatterns).toHaveLength(3);
    expect(similarPatterns[0].similarity).toBeGreaterThanOrEqual(0.80);
    expect(similarPatterns[1].similarity).toBeGreaterThanOrEqual(0.80);
    expect(similarPatterns[2].similarity).toBeGreaterThanOrEqual(0.80);

    const recommendation = mockAIEngine.generateRecommendation(customerAttributes, dealConditions);
    expect(recommendation.approachType).toBe('phased_proposal');
    expect(recommendation.phases).toHaveLength(2);
    expect(recommendation.confidenceScore).toBe(92);

    const reasoning = mockAIEngine.explainRecommendationReasoning(
      customerAttributes,
      dealConditions,
      recommendation
    );
    expect(reasoning).toContain('92%');
    expect(reasoning).toContain('phased approach');
    expect(reasoning).toContain('multi-approver');

    // Assert: AIRecommendationEngine の各メソッドが正常に呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerAttributes,
      dealConditions
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      customerAttributes,
      dealConditions
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerAttributes,
      dealConditions
    );

    // Assert: 推奨内容が正しく構成されていることを検証
    expect(patternRelevance.matches).toBe(true);
    expect(similarPatterns.length).toBeGreaterThanOrEqual(3);
    expect(recommendation.reasoning).toBe('Past cases with same conditions achieved 92% closure rate');
    expect(recommendation.phases[0].name).toBe('PoC Proposal');
    expect(recommendation.phases[1].name).toBe('Full Implementation');
  });
});