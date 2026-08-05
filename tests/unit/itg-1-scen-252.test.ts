import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-252: [edge] 標準プロセス遵守度スコア計算機能 - 商談記録の入力日と処理日が同日のとき正しく反映される
  test('商談記録の入力日と処理日が同日のとき、処理遅延日数0日・当日処理フラグtrue・スコア100点で計算される', () => {
    const dealRecordInputDateTime = new Date('2024-01-15T09:00:00Z');
    const dealRecordProcessDateTime = new Date('2024-01-15T14:30:00Z');

    const dealRecord = {
      dealId: 'deal-001',
      inputDateTime: dealRecordInputDateTime,
      processDateTime: dealRecordProcessDateTime,
      dealStage: 'proposal',
      customerId: 'customer-001',
      proposalContent: 'standard_proposal_template_001',
    };

    const result = calculateProcessComplianceScore(dealRecord);

    expect(result.processingDelayDays).toBe(0);
    expect(result.sameYearProcessingFlag).toBe(true);
    expect(result.processComplianceScore).toBe(100);
  });
});