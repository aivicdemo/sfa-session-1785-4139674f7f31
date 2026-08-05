import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-543
  test('[error] 営業活動ログデータが空配列の場合、エラーになる', () => {
    const empty_sales_activity_logs: any[] = [];

    const call_generate_report = () => {
      generateSalesActivityAnalysisReport({
        sales_activity_logs: empty_sales_activity_logs,
        standard_process_definition: {
          process_id: 'PROC-001',
          process_name: '標準営業プロセス',
          stages: [
            { stage_id: 'STAGE-1', stage_name: '初回接触' },
            { stage_id: 'STAGE-2', stage_name: '提案' },
            { stage_id: 'STAGE-3', stage_name: '交渉' },
            { stage_id: 'STAGE-4', stage_name: '成約' }
          ]
        },
        contract_results: [
          {
            contract_id: 'CONTRACT-001',
            sales_rep_id: 'REP-001',
            customer_id: 'CUST-001',
            contract_amount: 500000,
            contract_date: '2024-01-15'
          }
        ],
        analysis_period: {
          start_date: '2024-01-01',
          end_date: '2024-01-31'
        }
      });
    };

    expect(call_generate_report).toThrow(/営業活動ログデータが空/);
  });
});