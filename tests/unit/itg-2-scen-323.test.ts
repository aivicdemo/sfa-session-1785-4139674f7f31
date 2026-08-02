import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 乖離度計算処理', () => {
  // SCEN-323
  test('提案内容データが欠けている場合、その営業担当者の乖離度計算がスキップされる', () => {
    const salesPersonWithMissingProposal = {
      sales_person_id: 'SP001',
      customer_name: '顧客A',
      revenue_forecast: 500000,
      deal_stage: '提案',
      proposal_content: null,
      contact_count: 3,
      proposal_count: 1,
      quote_count: 1,
      contract_count: 0,
    };

    const salesPersonNormal = {
      sales_person_id: 'SP002',
      customer_name: '顧客B',
      revenue_forecast: 800000,
      deal_stage: '交渉',
      proposal_content: '提案内容が存在',
      contact_count: 5,
      proposal_count: 2,
      quote_count: 2,
      contract_count: 1,
    };

    const standardProcessSteps = [
      { step: '初回接触', expected_count: 1 },
      { step: '提案', expected_count: 1 },
      { step: '交渉', expected_count: 1 },
      { step: '成約', expected_count: 1 },
    ];

    const result = calculateDeviationScore({
      sales_persons: [salesPersonWithMissingProposal, salesPersonNormal],
      standard_process_steps: standardProcessSteps,
    });

    expect(result.skipped_sales_persons).toContain('SP001');
    expect(result.deviation_scores['SP001']).toBeNull();
    expect(result.deviation_scores['SP002']).toBe(0.25);
    expect(result.processing_log).toMatchObject({
      total_processed: 2,
      skipped_count: 1,
      completed_count: 1,
    });
  });
});