import { generateRecommendationWithValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1006
  test('提案資料生成処理の前提条件検証 - 顧客情報が未入力の場合、警告メッセージが表示される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyCustomerInfo = {
      customer_name: '',
      industry: '',
      business_scale: '',
      challenge_content: '',
    };

    const result = generateRecommendationWithValidation(
      emptyCustomerInfo,
      mockAIEngine
    );

    expect(result.success).toBe(false);
    expect(result.warning_message).toBe(
      '顧客情報が入力されていません。顧客名、業種、課題内容は必須項目です。'
    );
    expect(result.warning_color).toBe('red');
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});