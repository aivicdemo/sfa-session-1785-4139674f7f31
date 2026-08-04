import { generateExecutivePersuasionReport } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1996
  test('提案内容が顧客制約条件に違反しているとき、資料生成がエラーになる', () => {
    const customerConstraint = {
      customerId: 'cust-001',
      customerName: 'A社',
      industry: '製造業',
      budget: 5000000,
      constraintDescription: '導入期間は最短6ヶ月以上必須、クラウドベースのソリューション不可',
      minimumImplementationMonths: 6,
      allowCloudBased: false,
    };

    const proposalContent = {
      proposalId: 'prop-001',
      solutionName: 'クラウド型SaaS',
      implementationMonthsRequired: 3,
      isCloudBased: true,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      generateExecutivePersuasionReport(
        customerConstraint,
        proposalContent,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      )
    ).toThrow(/顧客制約条件/);

    expect(fileStorageAdapterStub.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});