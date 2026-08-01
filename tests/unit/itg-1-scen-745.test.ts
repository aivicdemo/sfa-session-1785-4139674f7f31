import { selectAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-745
  test('成約実績が0件の場合、プロセス定義の指標のみが選定対象となる', () => {
    const processDefinitionMetrics = [
      {
        id: 'metric_001',
        name: '初回接触日数',
        type: 'days_to_first_contact',
      },
      {
        id: 'metric_002',
        name: '提案回数',
        type: 'proposal_count',
      },
      {
        id: 'metric_003',
        name: '商談化率',
        type: 'opportunity_conversion_rate',
      },
    ];

    const performanceBasedMetrics = [
      {
        id: 'metric_004',
        name: '顧客属性別成約率',
        type: 'conversion_rate_by_customer_attribute',
      },
      {
        id: 'metric_005',
        name: '地域別成約実績',
        type: 'performance_by_region',
      },
    ];

    const closedDealsCount = 0;

    const result = selectAnalysisMetrics({
      processDefinitionMetrics,
      performanceBasedMetrics,
      closedDealsCount,
    });

    expect(result).toEqual([
      {
        id: 'metric_001',
        name: '初回接触日数',
        type: 'days_to_first_contact',
      },
      {
        id: 'metric_002',
        name: '提案回数',
        type: 'proposal_count',
      },
      {
        id: 'metric_003',
        name: '商談化率',
        type: 'opportunity_conversion_rate',
      },
    ]);
    expect(result.length).toBe(3);
    expect(result.every((m) => processDefinitionMetrics.some((p) => p.id === m.id))).toBe(
      true
    );
  });
});