import { validateProposalDataCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-891
  test('提案内容データが1件のときデータ完全性チェックを実行する', () => {
    const proposalData = {
      proposalId: 'PROP-20240115-001',
      proposalTitle: '営業システム導入提案',
      amount: 5000000,
      deadlineDateTime: new Date('2024-02-15T18:00:00Z')
    };

    const customerPurchaseConsiderationData = {
      customerId: 'CUST-12345',
      proposalContents: [proposalData]
    };

    const result = validateProposalDataCompleteness(customerPurchaseConsiderationData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.completenessScore).toBe(100);
  });
});