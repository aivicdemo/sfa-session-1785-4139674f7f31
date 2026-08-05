import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-231
  test('[error] 標準プロセス遵守度スコア計算機能 - 商談記録の実行日時が null のときエラーになる', () => {
    const dealRecord = {
      dealId: 'DEAL-20240115-001',
      processStep: 'initial_contact',
      salesRepId: 'REP-0001',
      customerId: 'CUST-0001',
      executedAt: null,
      proposalContent: 'Standard proposal',
      dealAmount: 100000,
      dealStatus: 'in_progress',
    };

    expect(() => calculateProcessComplianceScore(dealRecord)).toThrow(/executedAt/);
  });
});