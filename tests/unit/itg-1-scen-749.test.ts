import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-749
  test('[normal] 初回接触頻度がプロセス標準書に定義されていない場合、分析対象指標に含まれない', () => {
    const process_definition = {
      process_id: 'PROC_001',
      process_name: '標準営業プロセス',
      stages: [
        {
          stage_id: 'STAGE_001',
          stage_name: '初回接触',
          kpi_definitions: []
        },
        {
          stage_id: 'STAGE_002',
          stage_name: '提案',
          kpi_definitions: [
            {
              kpi_id: 'KPI_PROPOSAL_SUCCESS_RATE',
              kpi_name: '提案成功率'
            }
          ]
        },
        {
          stage_id: 'STAGE_003',
          stage_name: '交渉',
          kpi_definitions: [
            {
              kpi_id: 'KPI_NEGOTIATION_DURATION',
              kpi_name: '交渉期間'
            }
          ]
        },
        {
          stage_id: 'STAGE_004',
          stage_name: '成約',
          kpi_definitions: [
            {
              kpi_id: 'KPI_CLOSE_RATE',
              kpi_name: '成約率'
            }
          ]
        }
      ]
    };

    const contract_data = {
      total_closed_deals: 150,
      successful_closed_deals: 90,
      total_proposals: 120,
      successful_proposals: 85,
      average_negotiation_days: 14
    };

    const result = selectAnalysisIndicators(process_definition, contract_data);

    expect(result).toEqual({
      selected_indicators: [
        {
          indicator_id: 'IND_PROPOSAL_SUCCESS_RATE',
          indicator_name: '提案成功率',
          process_stage: 'STAGE_002',
          calculation_method: 'success_count / total_count',
          correlation_confirmed: true
        },
        {
          indicator_id: 'IND_CLOSE_RATE',
          indicator_name: '成約率',
          process_stage: 'STAGE_004',
          calculation_method: 'closed_count / total_count',
          correlation_confirmed: true
        }
      ],
      excluded_indicators: [
        {
          indicator_id: 'IND_INITIAL_CONTACT_FREQUENCY',
          indicator_name: '初回接触頻度',
          exclusion_reason: 'not_defined_in_process'
        }
      ],
      analysis_target_list_confirmed: true
    });

    const has_initial_contact_frequency = result.selected_indicators.some(
      (ind) => ind.indicator_name === '初回接触頻度'
    );
    expect(has_initial_contact_frequency).toBe(false);
  });
});