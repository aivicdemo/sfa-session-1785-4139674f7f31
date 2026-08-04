import { evaluateProposalRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  test('SCEN-2074: 過去成功パターンが1件の場合、そのパターンとの適合度が計算される', () => {
    // Arrange
    const mockRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const pastSuccessPattern = {
      patternId: 'PAT-001',
      industry: 'IT',
      proposalApproach: 'クラウド移行提案',
      historicalClosureRate: 0.85,
    };

    mockRecommendationEngine.findSimilarPatterns.mockResolvedValue([
      pastSuccessPattern,
    ]);

    mockRecommendationEngine.evaluatePatternRelevance.mockResolvedValue(0.92);

    const newProposalData = {
      customerIndustry: 'IT',
      customerScale: '中堅',
      customerChallenge: 'レガシーシステム刷新',
      proposalContent: 'クラウド移行ソリューション提案',
      salesApproach: '段階的な移行戦略の提示',
    };

    // Act
    const result = evaluateProposalRelevance(
      newProposalData,
      mockRecommendationEngine
    );

    // Assert
    expect(result).toEqual({
      relevanceScore: 0.92,
      relevancePercentage: 92,
      matchedPatternId: 'PAT-001',
      message: 'このパターンとの適合度は92%です',
      recommendationRationale:
        '過去のIT業界向けクラウド移行提案の成約実績（85%）に基づいた推奨',
      historicalClosureRate: 0.85,
    });

    expect(mockRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newProposalData
    );
    expect(
      mockRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith(pastSuccessPattern, newProposalData);
  });
});