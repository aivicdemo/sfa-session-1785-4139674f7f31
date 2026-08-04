import { generateRecommendationReasoningForApproach } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1939: [edge] 推奨内容の根拠表示機能 - 推奨タイプが提案アプローチのときに該当する根拠が抽出される
  test('推奨タイプが提案アプローチのとき、スコア0.7以上の過去成功事例に基づいた根拠説明が返却される', () => {
    const mockSimilarPatterns = [
      {
        patternId: 'pattern-001',
        customerId: 'cust-101',
        industry: '製造業',
        companySize: '大企業',
        proposalApproach: '段階的導入提案',
        successRate: 0.85,
        dealValue: 5000000,
        dealCycle: 90,
      },
      {
        patternId: 'pattern-002',
        customerId: 'cust-102',
        industry: '製造業',
        companySize: '大企業',
        proposalApproach: 'ROI最大化提案',
        successRate: 0.78,
        dealValue: 8000000,
        dealCycle: 120,
      },
      {
        patternId: 'pattern-003',
        customerId: 'cust-103',
        industry: '製造業',
        companySize: '大企業',
        proposalApproach: 'リスク低減提案',
        successRate: 0.65,
        dealValue: 3000000,
        dealCycle: 60,
      },
    ];

    const mockRelevanceScores = {
      'pattern-001': 0.82,
      'pattern-002': 0.76,
      'pattern-003': 0.68,
    };

    const mockExplainedReasoning =
      '過去の同業種・同規模企業との取引事例から、段階的導入提案とROI最大化提案が高い成功率（85%、78%）を示しています。特に段階的導入提案は提案から契約までが平均90日と短く、決裁者の納得を得やすいアプローチとなっています。';

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationType: '提案アプローチ',
        proposalApproach: '段階的導入提案',
        confidenceScore: 0.88,
        recommendedTiming: '即時',
        rationale: '顧客の予算計画と契約周期から最適',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: mockExplainedReasoning,
        relatedPatterns: ['pattern-001', 'pattern-002'],
        confidenceLevel: 'high',
      }),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((patternId) => mockRelevanceScores[patternId] ?? 0),
    };

    const inputParams = {
      recommendationType: '提案アプローチ',
      customerId: 'cust-new-001',
      industry: '製造業',
      companySize: '大企業',
      currentProposal: {
        approach: '段階的導入提案',
        value: 5500000,
        expectedCycle: 95,
      },
    };

    const result = generateRecommendationReasoningForApproach(
      inputParams,
      mockAIEngine
    );

    expect(result).toEqual({
      recommendationType: '提案アプローチ',
      explanation: mockExplainedReasoning,
      extractedReasons: [
        {
          patternId: 'pattern-001',
          relevanceScore: 0.82,
          approach: '段階的導入提案',
          successRate: 0.85,
          dealCycle: 90,
        },
        {
          patternId: 'pattern-002',
          relevanceScore: 0.76,
          approach: 'ROI最大化提案',
          successRate: 0.78,
          dealCycle: 120,
        },
      ],
      reasonCount: 2,
      hasRelevantEvidence: true,
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(inputParams);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '製造業',
        companySize: '大企業',
        recommendationType: '提案アプローチ',
      })
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
    expect(
      mockAIEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith('pattern-001');
    expect(
      mockAIEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith('pattern-002');
    expect(
      mockAIEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith('pattern-003');
  });
});