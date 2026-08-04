import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let mockAIEngine: any;
  let mockFileStorage: any;

  beforeEach(() => {
    mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };
    mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-2157
  test('[error] 推奨レポートのPDF/Excel生成 - 推奨根拠が null のとき、エラーが発生する', () => {
    const dealId = 'DEAL-001';
    const customerId = 'CUST-001';
    const format = 'pdf';
    const dealData = {
      id: dealId,
      customerId: customerId,
      customerName: 'テスト顧客',
      dealAmount: 1000000,
      stage: 'proposal',
      proposalApproach: 'consultative_sale',
    };

    mockAIEngine.explainRecommendationReasoning.mockReturnValue(null);

    const fn = () =>
      generateRecommendationReport(
        dealData,
        format,
        mockAIEngine,
        mockFileStorage
      );

    expect(fn).toThrow(/推奨根拠/);
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});