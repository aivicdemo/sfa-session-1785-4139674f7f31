import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  // SCEN-2587
  test('商談ステータスが欠落しているとき、例外が発生する', () => {
    const pastDealsWithMissingStatus = [
      {
        transaction_id: 'DEAL001',
        customer_id: 'CUST001',
        deal_status: 'closed_won',
        deal_amount: 500000,
        sales_cycle_days: 45,
      },
      {
        transaction_id: 'DEAL002',
        customer_id: 'CUST002',
        deal_status: null,
        deal_amount: 300000,
        sales_cycle_days: 60,
      },
      {
        transaction_id: 'DEAL003',
        customer_id: 'CUST003',
        deal_status: undefined,
        deal_amount: 400000,
        sales_cycle_days: 50,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(pastDealsWithMissingStatus),
    };

    expect(() => extractSuccessPatterns(pastDealsWithMissingStatus, mockAIEngine)).toThrow(/商談ステータス/);
  });
});