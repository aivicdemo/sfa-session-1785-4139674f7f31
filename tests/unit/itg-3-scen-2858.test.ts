import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨内容検証判定機能 - 営業担当者の行動パターン分析結果が null の場合', () => {
  test('SCEN-2858: 行動パターン分析結果が null のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue(null),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const testCase = {
      customer_id: 'CUST_001',
      customer_name: '株式会社テスト',
      industry: 'IT',
      company_size: 'large',
      deal_id: 'DEAL_2024_001',
      deal_amount: 5000000,
      deal_stage: 'proposal',
      contact_person: '営業担当太郎',
    };

    const result = validateRecommendationContent(testCase, mockAIRecommendationEngine);

    expect(result).toEqual({
      success: false,
      error_code: 'PATTERN_ANALYSIS_NULL',
      error_message: '営業担当者の行動パターン分析に失敗しました。データが取得できません',
      http_status: 400,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});