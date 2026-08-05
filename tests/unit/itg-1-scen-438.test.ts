import { standardizeCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-438
  test('[error] 複数の反応タイプが同時に指定されているとき、エラーが発生する', () => {
    const multipleReactionTypesInput = {
      reactionTypes: ['positive', 'negative', 'neutral'],
      recordedAt: '2024-01-15T11:00:00Z',
      customerId: 'CUST-001',
      salesPersonId: 'SP-001'
    };

    expect(() =>
      standardizeCustomerReaction(multipleReactionTypesInput)
    ).toThrow(/複数の反応タイプ/);
  });
});