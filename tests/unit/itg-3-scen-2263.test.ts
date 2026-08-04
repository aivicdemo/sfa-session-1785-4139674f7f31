import { analyzeProposalAndCustomerPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2263: 分析対象期間の開始日が終了日より後のとき、エラーになる', () => {
    const start_date = new Date('2026-08-15T00:00:00Z');
    const end_date = new Date('2026-08-10T00:00:00Z');
    const proposal_id = 'PROP-001';
    const customer_id = 'CUST-001';

    expect(() =>
      analyzeProposalAndCustomerPattern({
        proposal_id,
        customer_id,
        start_date,
        end_date,
      })
    ).toThrow(/分析対象期間の開始日は終了日以前の日付/);
  });
});