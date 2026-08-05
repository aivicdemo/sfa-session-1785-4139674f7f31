import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者別行動パターン分析レポート生成機能', () => {
  // SCEN-097
  test('営業担当者別分析レポート内に成約実績が正しく集計される', () => {
    const sales_rep_a_contract_count = 5;
    const sales_rep_a_contract_amount = 1000000;
    const sales_rep_b_contract_count = 3;
    const sales_rep_b_contract_amount = 600000;
    const sales_rep_c_contract_count = 7;
    const sales_rep_c_contract_amount = 1400000;

    const total_contract_count = 15;
    const total_contract_amount = 3000000;

    const input_data = {
      sales_reps: [
        {
          sales_rep_id: 'rep_a',
          sales_rep_name: 'Sales Rep A',
          contract_count: sales_rep_a_contract_count,
          contract_amount: sales_rep_a_contract_amount,
        },
        {
          sales_rep_id: 'rep_b',
          sales_rep_name: 'Sales Rep B',
          contract_count: sales_rep_b_contract_count,
          contract_amount: sales_rep_b_contract_amount,
        },
        {
          sales_rep_id: 'rep_c',
          sales_rep_name: 'Sales Rep C',
          contract_count: sales_rep_c_contract_count,
          contract_amount: sales_rep_c_contract_amount,
        },
      ],
    };

    const report = generateSalesRepBehaviorAnalysisReport(input_data);

    expect(report).toBeDefined();
    expect(report.sales_rep_results).toHaveLength(3);

    expect(report.sales_rep_results[0]).toEqual({
      sales_rep_id: 'rep_a',
      sales_rep_name: 'Sales Rep A',
      contract_count: 5,
      contract_amount: 1000000,
    });

    expect(report.sales_rep_results[1]).toEqual({
      sales_rep_id: 'rep_b',
      sales_rep_name: 'Sales Rep B',
      contract_count: 3,
      contract_amount: 600000,
    });

    expect(report.sales_rep_results[2]).toEqual({
      sales_rep_id: 'rep_c',
      sales_rep_name: 'Sales Rep C',
      contract_count: 7,
      contract_amount: 1400000,
    });

    expect(report.total_summary).toEqual({
      total_contract_count: 15,
      total_contract_amount: 3000000,
    });
  });
});