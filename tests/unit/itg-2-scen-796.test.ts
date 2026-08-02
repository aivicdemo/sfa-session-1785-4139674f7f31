import { determineCustomerMergeTarget } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-796
  test('重複候補顧客が1件の場合、統合判定が単一対象として処理される', () => {
    const baseCustomer = {
      customerId: 'CUST-000',
      name: '顧客太郎',
      email: 'customer@example.com',
    };

    const duplicateCandidates = [
      {
        customerId: 'CUST-001',
        name: '山田太郎',
        email: 'yamada@example.com',
      },
    ];

    const result = determineCustomerMergeTarget(
      baseCustomer,
      duplicateCandidates
    );

    expect(result.isSingleTarget).toBe(true);
    expect(result.mergeStatus).toBe('単一候補確定');
    expect(result.targetCustomerId).toBe('CUST-001');
    expect(result.processingMode).toBe('シングルマージ');
    expect(result.hasMultipleCandidates).toBe(false);
  });
});