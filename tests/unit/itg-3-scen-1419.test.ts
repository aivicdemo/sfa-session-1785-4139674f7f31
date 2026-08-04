import { validate } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1419
  test('実装期間が空のとき、照合結果が無効と判定される', () => {
    const proposal = {
      proposalId: 'PROP-001',
      proposalName: 'クラウド導入提案',
      implementationPeriod: null,
    };

    const customerConstraint = {
      customerId: 'CUST-001',
      maxBudget: 5000000,
      requiredCompletionDate: '2026-12-31',
    };

    const result = validate(proposal, customerConstraint);

    expect(result.isValid).toBe(false);
    expect(result.validationStatus).toBe('INVALID_REQUIRED_FIELD');
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        field: 'implementationPeriod',
        message: expect.stringMatching(/実装期間が指定されていません/),
      })
    );
  });
});