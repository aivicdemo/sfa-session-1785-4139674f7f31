import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2073
  test('[normal] 過去成功パターンが0件でも分析結果が生成される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationPatternMaster = [
      {
        patternId: 'PATTERN_MFG_001',
        industryType: '製造業',
        approachName: '業務効率化標準アプローチ',
        confidence: 0.85,
        description: '類似業種の成功事例に基づいた標準的なアプローチです',
      },
      {
        patternId: 'PATTERN_MFG_002',
        industryType: '製造業',
        approachName: 'コスト削減フォーカスアプローチ',
        confidence: 0.78,
        description: '類似業種の成功事例に基づいた標準的なアプローチです',
      },
    ];

    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendationId: 'REC_20260501_001',
      dealId: 'DEAL_NEW_20260501',
      customerId: 'CUST_MFG_12345',
      recommendedApproach: 'PATTERN_MFG_001',
      approachName: '業務効率化標準アプローチ',
      recommendationScore: 82,
      reasoning: '類似業種の成功事例に基づいた標準的なアプローチです',
      sourceType: 'PATTERN_MASTER',
      createdAt: new Date('2026-05-01T10:30:00Z'),
      status: 'ACTIVE',
    });

    const newDealData = {
      customerId: 'CUST_MFG_12345',
      customerIndustry: '製造業',
      dealAmount: 5000000,
      proposalContent: '業務効率化ツール導入',
      dealStage: 'INITIAL_PROPOSAL',
    };

    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      mockRecommendationPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.recommendationScore).toBe(82);
    expect(result.approachName).toBe('業務効率化標準アプローチ');
    expect(result.reasoning).toBe(
      '類似業種の成功事例に基づいた標準的なアプローチです'
    );
    expect(result.sourceType).toBe('PATTERN_MASTER');
    expect(result.status).toBe('ACTIVE');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST_MFG_12345',
        customerIndustry: '製造業',
        dealAmount: 5000000,
      })
    );
  });
});