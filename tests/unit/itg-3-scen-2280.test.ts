import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ自動推奨機能 - 顧客制約条件の照合ルール適用', () => {
  test('SCEN-2280: 顧客制約条件が設定されていないとき、照合ルール適用がエラーになる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(() => {
        throw new Error('CONSTRAINT_VALIDATION_ERROR: 顧客制約条件が設定されていません');
      }),
    };

    const proposalData = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-12345',
      productCategory: 'IT_SOLUTION',
      proposalAmount: 5000000,
      customerConstraints: null,
      successPatternId: 'PATTERN-SP001',
    };

    expect(() => {
      evaluatePatternRelevance(
        proposalData,
        mockAIEngine
      );
    }).toThrow(/CONSTRAINT_VALIDATION_ERROR/);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-20240115-001',
        customerConstraints: null,
      })
    );
  });
});