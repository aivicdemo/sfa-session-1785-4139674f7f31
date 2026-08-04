import { analyzeProposalAgainstStandardProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案内容と顧客対応パターン分析機能', () => {
  // SCEN-2261
  test('顧客IDが未設定のとき、標準プロセスとの比較がエラーになる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      customerId: null,
      proposalContent: {
        productCategory: '営業支援システム',
        proposedValue: 'プロセス自動化による工数削減',
        targetBudget: 500000,
      },
      customerResponsePattern: {
        initialReaction: 'positive',
        followUpCount: 2,
        decisionTimeDays: 14,
      },
    };

    expect(() => {
      analyzeProposalAgainstStandardProcess(inputData, mockAIEngine);
    }).toThrow(/顧客ID/);

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});