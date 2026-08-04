import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIRecommendationEngine - Past Deal Data Null Handling', () => {
  test('SCEN-1873: [error] 成功パターン抽出・照合・推奨機能 - 過去商談データが null のとき成功パターン抽出に失敗する', () => {
    const mockAIEngine = new AIRecommendationEngine();
    
    const newDealData = {
      customerId: 'CUST-12345',
      customerIndustry: 'Manufacturing',
      customerSize: 'Enterprise',
      dealAmount: 5000000,
      dealStage: 'Proposal',
      targetProduct: 'ERP System'
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    expect(() => {
      mockAIEngine.generateRecommendation(
        newDealData,
        null as any,
        mockFileStorageAdapter
      );
    }).toThrow(/pastDealData|Past deal data/i);
  });
});