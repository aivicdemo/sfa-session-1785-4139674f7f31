import { calculateProposalROI } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1311: 提案内容と顧客制約条件の自動照合機能 - 投資対効果が計算されるとき、提案金額に対するROIが数値で表示される', () => {
    // Arrange
    const proposalInput = {
      customerId: 'customer_001',
      customerName: 'テスト顧客A',
      annualRevenue: 10000000,
      challenge: '業務効率化',
      proposalAmount: 2000000,
      expectedAnnualEffect: 4000000
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalAmount: 2000000,
        expectedEffect: 4000000
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue(''),
      generateDownloadUrl: jest.fn().mockResolvedValue(''),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined)
    };

    // Act
    const result = calculateProposalROI(
      proposalInput,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    // Assert
    expect(result.roiPercentage).toBe(200);
    expect(result.roiDisplay).toBe('200%');
    expect(result.proposalAmount).toBe(2000000);
    expect(result.expectedAnnualEffect).toBe(4000000);
    expect(result.netBenefit).toBe(2000000);
  });
});