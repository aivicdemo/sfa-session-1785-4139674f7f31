import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  selectAnalysisIndicators,
} from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1057
  test('[normal] 営業プロセス標準書と成約実績が存在する場合、提案成功率が指標リストに含まれる', () => {
    const sales_process_standard_book = {
      process_id: 'proc_001',
      version: '1.0',
      stage_definitions: [
        {
          stage_name: '初回接触',
          description: '顧客への初回コンタクト実施',
          key_metrics: ['初回接触頻度'],
        },
        {
          stage_name: '提案',
          description: '顧客への提案実施',
          key_metrics: ['提案成功率', '提案内容適合度'],
        },
        {
          stage_name: '交渉',
          description: '条件交渉実施',
          key_metrics: ['交渉成功率'],
        },
        {
          stage_name: '成約',
          description: '成約締結',
          key_metrics: ['成約率'],
        },
      ],
      process_definition_updated_at: '2024-01-01T00:00:00Z',
    };

    const sales_results = [
      {
        deal_id: 'deal_001',
        sales_person_id: 'salesperson_001',
        customer_id: 'customer_001',
        proposal_content: 'Product A proposal',
        contract_amount: 500000,
        is_successful: true,
        closed_date: '2024-01-15T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        deal_id: 'deal_002',
        sales_person_id: 'salesperson_001',
        customer_id: 'customer_002',
        proposal_content: 'Product B proposal',
        contract_amount: 300000,
        is_successful: true,
        closed_date: '2024-01-20T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
      },
      {
        deal_id: 'deal_003',
        sales_person_id: 'salesperson_002',
        customer_id: 'customer_003',
        proposal_content: 'Product C proposal',
        contract_amount: 0,
        is_successful: false,
        closed_date: null,
        created_at: '2024-01-10T00:00:00Z',
      },
    ];

    const result = selectAnalysisIndicators(
      sales_process_standard_book,
      sales_results
    );

    expect(result.selected_indicators).toContain('提案成功率');
  });
});