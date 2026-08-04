import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-661: [edge] 顧客情報入力検証機能 - 顧客名にのみ形式エラーがあるとき、顧客名のみ修正を促す
  test('顧客名に特殊文字のみが入力された場合、顧客名フィールドのみエラーメッセージを表示し、その他フィールドの値は保持される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customer_name: '@#$',
      email: 'test@example.com',
      phone_number: '09012345678',
      address: '東京都渋谷区',
      aiEngine: mockAIRecommendationEngine,
    };

    const result = validateCustomerInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      customer_name: '顧客名は半角英数字、日本語、ハイフン、スペースのみ使用可能です',
      email: undefined,
      phone_number: undefined,
      address: undefined,
    });
    expect(result.focus_field).toBe('customer_name');
    expect(result.retained_values).toEqual({
      email: 'test@example.com',
      phone_number: '09012345678',
      address: '東京都渋谷区',
    });
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});