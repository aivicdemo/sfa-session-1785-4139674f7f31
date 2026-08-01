import {
  analyzeProposalExecution,
} from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-394
  test('分析対象となる提案実行レコードが1件の場合、該当の1件に対して乖離度と合致度が計算される', async () => {
    fetchMock.resetMocks();

    const proposal_execution_record = {
      sales_person_id: 'A001',
      proposal_date: '2024-01-15',
      proposal_amount: 5000000,
      contract_status: 'contracted',
      contract_amount: 5000000,
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        customer_id: 'C001',
        customer_name: 'Sample Customer',
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        market_segment: 'technology',
        average_contract_amount: 5000000,
      }),
      { status: 200 }
    );

    const result = await analyzeProposalExecution({
      sales_person_id: proposal_execution_record.sales_person_id,
      records: [proposal_execution_record],
    });

    expect(result).toEqual({
      sales_person_id: 'A001',
      divergence_score: 0.0,
      conformity_score: 100.0,
      record_count: 1,
      report_entries: [
        {
          proposal_date: '2024-01-15',
          proposal_amount: 5000000,
          contract_amount: 5000000,
          divergence: 0.0,
          conformity: 100.0,
        },
      ],
    });

    expect(result.record_count).toBe(1);
    expect(result.divergence_score).toBe(0.0);
    expect(result.conformity_score).toBe(100.0);
  });
});