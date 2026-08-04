import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1846
  test('推奨タイミングが空文字列のとき根拠情報の生成に失敗する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const inputParams = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      proposalContent: '営業支援ツール導入提案',
      recommendationTiming: '',
      successPatterns: [
        {
          patternId: 'PATTERN-001',
          industryType: '製造業',
          companyScale: '中堅企業',
          successFactors: ['ROI向上', '業務効率化'],
        },
      ],
      pastCaseData: [
        {
          caseId: 'CASE-2024-001',
          customerIndustry: '製造業',
          dealAmount: 5000000,
          closureResult: true,
          timeToClose: 60,
        },
      ],
      aiEngine: mockAIRecommendationEngine,
    };

    expect(() => {
      explainRecommendationReasoning(inputParams);
    }).toThrow(/推奨タイミング/);

    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).not.toHaveBeenCalled();
  });
});