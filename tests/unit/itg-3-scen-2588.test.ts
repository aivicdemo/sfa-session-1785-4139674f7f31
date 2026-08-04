import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2588
  test('[error] 過去商談データからの成功パターン抽出機能 - 商談金額が欠落しているとき、例外が発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const pastDealsWithMissingAmount = [
      {
        deal_id: 'DEAL-001',
        customer_name: 'ABC Corporation',
        industry: 'Manufacturing',
        company_size: 'Large',
        deal_amount: null,
        deal_status: 'Won',
        deal_date: '2024-01-15',
      },
    ];

    expect(() => {
      findSimilarPatterns(
        pastDealsWithMissingAmount,
        mockAIEngine
      );
    }).toThrow(/商談金額/);
  });
});