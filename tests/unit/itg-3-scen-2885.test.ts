import { evaluateRecommendationValidity } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 商談条件空値エラー処理', () => {
  // SCEN-2885
  test('新規案件の商談条件が空のとき、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData_null_conditions = {
      customerId: 'CUST-20240115-001',
      customerName: 'テスト企業株式会社',
      industry: '製造業',
      companySize: '従業員500名',
      dealConditions: null,
    };

    expect(() =>
      evaluateRecommendationValidity(newDealData_null_conditions, mockAIEngine)
    ).toThrow(/DEAL_CONDITIONS_EMPTY/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });

  test('新規案件の商談条件がundefinedのとき、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData_undefined_conditions = {
      customerId: 'CUST-20240115-002',
      customerName: 'テスト企業2株式会社',
      industry: 'IT',
      companySize: '従業員100名',
      dealConditions: undefined,
    };

    expect(() =>
      evaluateRecommendationValidity(
        newDealData_undefined_conditions,
        mockAIEngine
      )
    ).toThrow(/DEAL_CONDITIONS_EMPTY/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });

  test('新規案件の商談条件が空オブジェクトのとき、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData_empty_object_conditions = {
      customerId: 'CUST-20240115-003',
      customerName: 'テスト企業3株式会社',
      industry: 'サービス業',
      companySize: '従業員50名',
      dealConditions: {},
    };

    expect(() =>
      evaluateRecommendationValidity(
        newDealData_empty_object_conditions,
        mockAIEngine
      )
    ).toThrow(/DEAL_CONDITIONS_EMPTY/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});