import { generatePDFReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2158
  test('推奨レポートのPDF生成時に推奨根拠が空オブジェクトの場合、ValidationErrorが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec_12345',
        customer_id: 'cust_001',
        approach: '提案アプローチA',
        recommended_timing: '2024-02-15',
        reasoning: {}
      })
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn()
    };

    const newProjectData = {
      customer_id: 'cust_001',
      customer_name: '株式会社テスト',
      industry: '製造業',
      company_size: '中堅企業',
      deal_conditions: {
        product_category: 'ソフトウェア',
        budget_range: '500万円～1000万円',
        timeline: '3ヶ月以内'
      }
    };

    expect(() =>
      generatePDFReport(
        newProjectData,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/推奨根拠/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});