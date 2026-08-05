import { calculateProcessComplianceScore } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-579
  test('進捗ステップが欠落している場合、エラーになる', () => {
    const sales_deal_id = 'deal_001';
    const process_def_id = 'proc_def_001';
    
    // 標準プロセス定義: 4つのステップ
    const process_definition = {
      process_def_id: process_def_id,
      stage_name: '標準営業プロセス',
      steps: [
        { step_id: 'step_001', step_name: '初回接触', order: 1 },
        { step_id: 'step_002', step_name: '提案', order: 2 },
        { step_id: 'step_003', step_name: '交渉', order: 3 },
        { step_id: 'step_004', step_name: '成約', order: 4 }
      ]
    };

    // 欠落ステップを含む進捗データ
    const process_execution_progress = [
      {
        sales_deal_id: sales_deal_id,
        process_def_id: process_def_id,
        step_id: 'step_001',
        step_name: '初回接触',
        completed_flag: true,
        completed_at: '2024-01-10T09:00:00Z'
      },
      {
        sales_deal_id: sales_deal_id,
        process_def_id: process_def_id,
        step_id: 'step_002',
        step_name: '提案',
        completed_flag: true,
        completed_at: '2024-01-12T14:30:00Z'
      },
      null, // 欠落したステップ
      {
        sales_deal_id: sales_deal_id,
        process_def_id: process_def_id,
        step_id: 'step_004',
        step_name: '成約',
        completed_flag: false,
        completed_at: null
      }
    ];

    const input = {
      sales_deal_id: sales_deal_id,
      process_definition: process_definition,
      process_execution_progress: process_execution_progress
    };

    expect(() => calculateProcessComplianceScore(input)).toThrow(/進捗ステップ/);
  });
});