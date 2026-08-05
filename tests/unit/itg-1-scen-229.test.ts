import { calculateStandardProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-229: [error] 標準プロセス遵守度スコア計算機能 - 商談記録のステップ情報が null のときエラーになる
  test('should throw error when stepInfo is null in transaction record', () => {
    const transactionRecord = {
      transaction_id: 'TXN-20240115-001',
      sales_rep_id: 'REP-0001',
      customer_id: 'CUST-0001',
      transaction_date: '2024-01-15T11:00:00Z',
      stepInfo: null,
      proposal_content: 'Enterprise solution package',
      customer_response: 'positive',
    };

    expect(() => calculateStandardProcessComplianceScore(transactionRecord)).toThrow(/stepInfo/);
  });
});