import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料生成', () => {
  test('SCEN-1999: 改善提案が0件のとき、資料生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'カスタマイズ提案',
        confidenceScore: 85,
        improvementSuggestions: [],
        riskFactors: ['予算制約'],
        nextActions: [],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const customerInfo = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: 'large',
      businessChallenge: 'デジタル化の遅れ',
    };

    const dealContent = {
      dealId: 'DEAL-001',
      proposedSolution: '業務システム導入',
      estimatedInvestment: 5000000,
      implementationSchedule: '6ヶ月',
    };

    expect(() =>
      generateExecutivePersuasionMaterial(
        customerInfo,
        dealContent,
        mockAIEngine,
        mockFileStorage,
      ),
    ).toThrow(/改善提案/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});