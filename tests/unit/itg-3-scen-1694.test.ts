import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1694: 過去商談データに商談金額フィールドが欠けている場合、エラーをスロー', () => {
    const pastDealsWithMissingAmount = [
      {
        deal_id: 'DEAL001',
        customer_industry: 'manufacturing',
        deal_size: 'large',
        budget_range: 'high',
        deal_amount: 5000000,
        deal_status: 'won',
      },
      {
        deal_id: 'DEAL002',
        customer_industry: 'retail',
        deal_size: 'medium',
        budget_range: 'medium',
        deal_amount: undefined,
        deal_status: 'won',
      },
    ];

    const searchCondition = {
      customer_industry: 'retail',
      deal_size: 'medium',
      budget_range: 'medium',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    expect(() =>
      findSimilarPatterns(pastDealsWithMissingAmount, searchCondition, mockAIEngine)
    ).toThrow(/商談金額/);
  });
});