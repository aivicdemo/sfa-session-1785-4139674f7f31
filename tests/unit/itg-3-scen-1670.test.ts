import { calculateScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1670
  test('推奨スコア算出機能 - 購買履歴データに日付フィールドが欠けているとき、エラーが発生する', () => {
    const purchase_history_missing_date = {
      product_id: 'PROD001',
      amount: 50000,
      customer_id: 'CUST001',
    };

    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockResolvedValue(null),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const file_storage_stub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue(''),
      generateDownloadUrl: jest.fn().mockResolvedValue(''),
      deleteExpiredReports: jest.fn().mockResolvedValue(void 0),
    };

    expect(() => {
      calculateScore(purchase_history_missing_date, ai_engine_stub, file_storage_stub);
    }).toThrow(/購買履歴データの必須フィールド 'date'/);

    expect(ai_engine_stub.generateRecommendation).not.toHaveBeenCalled();
    expect(ai_engine_stub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(ai_engine_stub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(ai_engine_stub.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(file_storage_stub.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(file_storage_stub.generateDownloadUrl).not.toHaveBeenCalled();
    expect(file_storage_stub.deleteExpiredReports).not.toHaveBeenCalled();
  });
});