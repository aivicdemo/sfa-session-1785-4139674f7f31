import { selectDefaultBehaviorAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-772
  test('[normal] 分析対象指標の定義がない場合、デフォルト指標が選定される', () => {
    const result = selectDefaultBehaviorAnalysisMetrics();

    expect(result).toEqual([
      {
        metric_id: 1,
        metric_name: '売上高',
        metric_code: 'REVENUE',
      },
      {
        metric_id: 2,
        metric_name: '案件数',
        metric_code: 'OPPORTUNITY_COUNT',
      },
      {
        metric_id: 3,
        metric_name: '成約率',
        metric_code: 'CLOSE_RATE',
      },
      {
        metric_id: 4,
        metric_name: '平均商談期間',
        metric_code: 'AVG_DEAL_DURATION',
      },
      {
        metric_id: 5,
        metric_name: '受注金額',
        metric_code: 'CONTRACTED_AMOUNT',
      },
    ]);

    expect(result.length).toBe(5);
    expect(result[0].metric_id).toBe(1);
    expect(result[4].metric_id).toBe(5);
  });
});