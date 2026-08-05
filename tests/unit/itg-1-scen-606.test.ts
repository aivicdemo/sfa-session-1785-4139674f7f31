import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-606
  test('営業担当者が提案を1件入力した場合、そのデータに基づきレポートが生成される', () => {
    const sales_rep_id = 'user_001';
    const proposal_title = 'A社向けシステム提案';
    const proposal_datetime = '2024-01-15T10:30:00Z';
    const proposal_amount = 5000000;
    const status = '提案済み';
    const industry = '製造業';
    const period_start = '2024-01-01';
    const period_end = '2024-01-31';

    const input_proposals = [
      {
        proposal_id: 'prop_001',
        sales_rep_id: sales_rep_id,
        title: proposal_title,
        proposal_datetime: proposal_datetime,
        amount: proposal_amount,
        status: status,
        industry: industry,
      },
    ];

    const result = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      period_start: period_start,
      period_end: period_end,
      proposals: input_proposals,
    });

    expect(result).toEqual({
      sales_rep_id: sales_rep_id,
      period_start: period_start,
      period_end: period_end,
      proposal_count: 1,
      total_proposal_amount: 5000000,
      average_proposal_amount: 5000000,
      most_frequent_industry: '製造業',
      proposals: [
        {
          proposal_id: 'prop_001',
          title: proposal_title,
          proposal_datetime: proposal_datetime,
          amount: proposal_amount,
          status: status,
          industry: industry,
        },
      ],
    });
  });
});