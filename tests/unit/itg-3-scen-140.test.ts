import { generateRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-140: 推奨根拠生成機能 - AIエージェント正常応答時に根拠が正常に生成される', async () => {
    const mockSimilarPatterns = [
      {
        patternId: 'PAT001',
        customerIndustry: '製造業',
        customerSize: '中堅企業',
        employeeCount: 250,
        contractValue: 5000000,
        approachType: '導入支援型',
        contractRate: 0.78,
        caseDetails: '過去事例1：同規模製造業への導入支援案件'
      },
      {
        patternId: 'PAT002',
        customerIndustry: '製造業',
        customerSize: '中堅企業',
        employeeCount: 280,
        contractValue: 4500000,
        approachType: '導入支援型',
        contractRate: 0.76,
        caseDetails: '過去事例2：同規模製造業への導入支援案件'
      },
      {
        patternId: 'PAT003',
        customerIndustry: '製造業',
        customerSize: '中堅企業',
        employeeCount: 220,
        contractValue: 5500000,
        approachType: '導入支援型',
        contractRate: 0.80,
        caseDetails: '過去事例3：同規模製造業への導入支援案件'
      }
    ];

    const mockReasoningExplanation =
      '顧客規模が中堅企業で、過去同規模案件の成約率が78%。提案アプローチは導入支援型を推奨';

    const mockRelevanceScore = 0.85;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC001',
        status: 'SUCCESS',
        proposedApproach: '導入支援型'
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockReasoningExplanation),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(mockRelevanceScore)
    };

    const newCaseData = {
      customerName: 'XX株式会社',
      industry: '製造業',
      employeeCount: 250,
      budgetAmount: 5000000
    };

    const result = await generateRecommendationReasoning(
      newCaseData,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.reasoningBasis).toBeDefined();

    const reasoningBasis = result.reasoningBasis;
    expect(reasoningBasis.similarCases).toHaveLength(3);
    expect(reasoningBasis.similarCases[0]).toEqual(mockSimilarPatterns[0]);
    expect(reasoningBasis.similarCases[1]).toEqual(mockSimilarPatterns[1]);
    expect(reasoningBasis.similarCases[2]).toEqual(mockSimilarPatterns[2]);

    expect(reasoningBasis.explanation).toBe(mockReasoningExplanation);
    expect(
      reasoningBasis.explanation.includes(
        '顧客規模が中堅企業で、過去同規模案件の成約率が78%'
      )
    ).toBe(true);
    expect(
      reasoningBasis.explanation.includes('提案アプローチは導入支援型を推奨')
    ).toBe(true);

    expect(reasoningBasis.patternRelevanceScore).toBe(0.85);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newCaseData
    );
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(mockSimilarPatterns, newCaseData);
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith(mockSimilarPatterns, newCaseData);
  });
});