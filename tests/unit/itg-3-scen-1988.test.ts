import { generateExecutivePresentationMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料の自動生成', () => {
  test('SCEN-1988: 提案内容が未設定（null）のとき、資料生成がエラーになる', () => {
    // 顧客情報は正常に設定
    const payload = {
      customerId: 'CUST-001',
      customerName: '株式会社サンプル',
      industry: '製造業',
      revenue: 5000000000,
      proposalContent: null,
      targetExecutiveLevel: '経営層'
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // FileStorageAdapterのスタブ
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // 関数実行とエラー検証
    expect(() =>
      generateExecutivePresentationMaterial(payload, mockAIEngine, mockFileStorage)
    ).toThrow(/提案内容/);

    // スタブが呼ばれていないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();

    // エラーオブジェクトの検証
    try {
      generateExecutivePresentationMaterial(payload, mockAIEngine, mockFileStorage);
    } catch (error: any) {
      expect(error.errorType).toBe('ValidationError');
      expect(error.errorCode).toBe('PROPOSAL_CONTENT_REQUIRED');
      expect(error.errorMessage).toBe('提案内容は必須項目です');
      expect(error.httpStatusCode).toBe(400);
    }
  });
});