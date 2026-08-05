import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-225: 標準プロセス遵守度スコア計算機能 - 商談記録の営業担当者IDが null のときエラーになる', () => {
    const salesRecordWithNullSalesPersonId = {
      dealId: 'D-20240115-001',
      dealName: '顧客A 新規システム導入案件',
      salesPersonId: null,
      processStep: 'initial_contact',
      stepCompletionDate: new Date('2024-01-15T10:00:00Z'),
      expectedProcessSequence: ['initial_contact', 'proposal', 'negotiation', 'contract'],
      actualProcessSequence: ['initial_contact'],
      customerId: 'C-12345',
    };

    expect(() => calculateProcessComplianceScore(salesRecordWithNullSalesPersonId)).toThrow(/営業担当者ID/);
  });
});