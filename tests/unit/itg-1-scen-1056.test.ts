import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1056
  test('[normal] 営業プロセス標準書と成約実績が存在する場合、初回接触頻度が指標リストに含まれる', () => {
    const sales_process_definitions = [
      {
        id: 'spd_001',
        name: '標準営業プロセス',
        stages: [
          { stage_id: 'stage_1', stage_name: '初回接触', order: 1 },
          { stage_id: 'stage_2', stage_name: '提案', order: 2 },
          { stage_id: 'stage_3', stage_name: '交渉', order: 3 },
          { stage_id: 'stage_4', stage_name: '成約', order: 4 }
        ],
        kpi_criteria: [
          { kpi_id: 'kpi_1', kpi_name: '初回接触頻度', target_value: 5 },
          { kpi_id: 'kpi_2', kpi_name: '提案成功率', target_value: 40 },
          { kpi_id: 'kpi_3', kpi_name: 'フォローアップ間隔', target_value: 3 }
        ]
      }
    ];

    const sales_results = [
      {
        id: 'result_001',
        sales_person_id: 'sp_001',
        customer_id: 'cust_001',
        deal_id: 'deal_001',
        contract_amount: 500000,
        contract_date: new Date('2024-01-10T10:00:00Z'),
        initial_contact_date: new Date('2023-12-20T09:00:00Z'),
        proposal_date: new Date('2024-01-02T14:00:00Z'),
        negotiation_date: new Date('2024-01-05T11:00:00Z'),
        status: 'completed'
      },
      {
        id: 'result_002',
        sales_person_id: 'sp_002',
        customer_id: 'cust_002',
        deal_id: 'deal_002',
        contract_amount: 300000,
        contract_date: new Date('2024-01-15T15:00:00Z'),
        initial_contact_date: new Date('2024-01-01T10:00:00Z'),
        proposal_date: new Date('2024-01-08T13:00:00Z'),
        negotiation_date: new Date('2024-01-12T16:00:00Z'),
        status: 'completed'
      }
    ];

    const result = selectAnalysisIndicators(sales_process_definitions, sales_results);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const initial_contact_frequency_indicator = result.find(
      (indicator) => indicator.name === '初回接触頻度'
    );
    expect(initial_contact_frequency_indicator).toBeDefined();
    expect(initial_contact_frequency_indicator?.name).toBe('初回接触頻度');
  });
});