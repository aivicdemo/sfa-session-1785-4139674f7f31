import { integrateDataFromPurchaseAndProposal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-966: [normal] 購買結果記録・営業データ統合機能 - 購買結果に関連する提案内容が1件の場合に正しく統合される', () => {
    const purchase_result = {
      purchase_id: 'PUR-001',
      customer_id: 'CUST-123',
      purchase_amount: 50000,
      purchase_date: new Date('2024-01-15T00:00:00Z'),
    };

    const proposal_content = {
      proposal_id: 'PROP-456',
      proposal_amount: 50000,
      proposal_date: new Date('2024-01-10T00:00:00Z'),
      status: '成約',
    };

    const integrated_data = integrateDataFromPurchaseAndProposal(
      purchase_result,
      proposal_content
    );

    expect(integrated_data.purchase_id).toBe('PUR-001');
    expect(integrated_data.proposal_id).toBe('PROP-456');
    expect(integrated_data.customer_id).toBe('CUST-123');
    expect(integrated_data.purchase_amount).toBe(50000);
    expect(integrated_data.proposal_amount).toBe(50000);
    expect(integrated_data.purchase_date).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(integrated_data.proposal_date).toEqual(new Date('2024-01-10T00:00:00Z'));
    expect(integrated_data.status).toBe('成約');
  });
});