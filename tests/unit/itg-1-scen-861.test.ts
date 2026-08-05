import { analyzeMonthlyContractRates } from '../../src/logic/it-1-br-2-1-1';

describe('月次営業品質統計分析機能 - 過去3ヶ月の営業担当者別成約率集計', () => {
  // SCEN-861
  test('過去3ヶ月の営業担当者別成約率が正常に集計される', () => {
    const reference_date = new Date('2024-01-31T00:00:00Z');

    const mock_contract_data = [
      {
        sales_rep_id: 'A',
        month: '2023-11',
        contracts_closed: 20,
        proposals_submitted: 25,
      },
      {
        sales_rep_id: 'A',
        month: '2023-12',
        contracts_closed: 15,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'A',
        month: '2024-01',
        contracts_closed: 17,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'B',
        month: '2023-11',
        contracts_closed: 12,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'B',
        month: '2023-12',
        contracts_closed: 13,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'B',
        month: '2024-01',
        contracts_closed: 14,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'C',
        month: '2023-11',
        contracts_closed: 18,
        proposals_submitted: 20,
      },
      {
        sales_rep_id: 'C',
        month: '2023-12',
        contracts_closed: 22,
        proposals_submitted: 25,
      },
      {
        sales_rep_id: 'C',
        month: '2024-01',
        contracts_closed: 23,
        proposals_submitted: 25,
      },
    ];

    const result = analyzeMonthlyContractRates(reference_date, mock_contract_data);

    expect(result).toBeDefined();
    expect(result.analysis_date).toEqual(reference_date);
    expect(result.sales_rep_statistics).toBeDefined();
    expect(Array.isArray(result.sales_rep_statistics)).toBe(true);
    expect(result.sales_rep_statistics.length).toBe(3);

    const rep_a_stats = result.sales_rep_statistics.find(
      (stat: { sales_rep_id: string }) => stat.sales_rep_id === 'A',
    );
    expect(rep_a_stats).toBeDefined();
    expect(rep_a_stats.monthly_rates).toEqual([
      { month: '2023-11', contract_rate: 80 },
      { month: '2023-12', contract_rate: 75 },
      { month: '2024-01', contract_rate: 85 },
    ]);
    expect(rep_a_stats.average_rate).toBe(80);

    const rep_b_stats = result.sales_rep_statistics.find(
      (stat: { sales_rep_id: string }) => stat.sales_rep_id === 'B',
    );
    expect(rep_b_stats).toBeDefined();
    expect(rep_b_stats.monthly_rates).toEqual([
      { month: '2023-11', contract_rate: 60 },
      { month: '2023-12', contract_rate: 65 },
      { month: '2024-01', contract_rate: 70 },
    ]);
    expect(rep_b_stats.average_rate).toBe(65);

    const rep_c_stats = result.sales_rep_statistics.find(
      (stat: { sales_rep_id: string }) => stat.sales_rep_id === 'C',
    );
    expect(rep_c_stats).toBeDefined();
    expect(rep_c_stats.monthly_rates).toEqual([
      { month: '2023-11', contract_rate: 90 },
      { month: '2023-12', contract_rate: 88 },
      { month: '2024-01', contract_rate: 92 },
    ]);
    expect(rep_c_stats.average_rate).toBe(90);

    const total_contracts_a =
      rep_a_stats.monthly_rates.reduce(
        (sum: number, m: { contract_rate: number }) => sum + m.contract_rate,
        0,
      ) / 3;
    expect(total_contracts_a).toBe(80);

    const total_contracts_b =
      rep_b_stats.monthly_rates.reduce(
        (sum: number, m: { contract_rate: number }) => sum + m.contract_rate,
        0,
      ) / 3;
    expect(total_contracts_b).toBe(65);

    const total_contracts_c =
      rep_c_stats.monthly_rates.reduce(
        (sum: number, m: { contract_rate: number }) => sum + m.contract_rate,
        0,
      ) / 3;
    expect(total_contracts_c).toBe(90);
  });
});