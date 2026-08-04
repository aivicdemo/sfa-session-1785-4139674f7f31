import { validateCustomerDataCompletenessAndAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客データ完全性・妥当性判定', () => {
  // SCEN-755: [edge] 顧客データ完全性・妥当性判定機能 - 参照可能な商談条件マスタが 0 件のとき、推奨生成不可と判定される
  test('参照可能な商談条件マスタが0件のとき、推奨生成不可と判定され、INSUFFICIENT_MASTER_DATAステータスが返却される', () => {
    const customerId = 'CUST-20240115-001';
    const dealId = 'DEAL-20240115-001';

    const mockDealConditionMasterRepository = {
      findAccessibleRecords: jest.fn().mockReturnValue([]),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateCustomerDataCompletenessAndAppropriateness(
      {
        customerId,
        dealId,
      },
      mockDealConditionMasterRepository,
      mockAIRecommendationEngine
    );

    expect(result.isRecommendationGenerationPossible).toBe(false);
    expect(result.judgmentStatusCode).toBe('INSUFFICIENT_MASTER_DATA');
    expect(result.userMessage).toBe(
      '推奨を生成するための商談条件マスタが登録されていません。システム管理者にお問い合わせください'
    );
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});