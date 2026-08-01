import { describe, test, expect } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-154: 標準プロセスのステップが乖離していないとき、乖離パターンが空として記録される', () => {
    const sales_rep_id = 'SALES001';
    const base_date = new Date('2024-01-01T09:00:00Z');

    const records = Array.from({ length: 10 }, (_, idx) => {
      const initial_contact_date = new Date(base_date);
      initial_contact_date.setDate(initial_contact_date.getDate() + idx * 20);

      const proposal_date = new Date(initial_contact_date);
      proposal_date.setDate(proposal_date.getDate() + 3);

      const negotiation_date = new Date(proposal_date);
      negotiation_date.setDate(negotiation_date.getDate() + 5);

      const contract_date = new Date(negotiation_date);
      contract_date.setDate(contract_date.getDate() + 7);

      return {
        sales_rep_id: sales_rep_id,
        deal_id: `DEAL${String(idx + 1).padStart(3, '0')}`,
        step_initial_contact: initial_contact_date.toISOString(),
        step_proposal: proposal_date.toISOString(),
        step_negotiation: negotiation_date.toISOString(),
        step_contract: contract_date.toISOString(),
        contract_status: 'won'
      };
    });

    const report = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      deal_records: records,
      standard_lead_times: {
        initial_to_proposal_days: 3,
        proposal_to_negotiation_days: 5,
        negotiation_to_contract_days: 7
      }
    });

    expect(report).toEqual({
      sales_rep_id: sales_rep_id,
      total_deals: 10,
      deviation_patterns: [],
      deviation_score: 0.0,
      process_adherence_rate: 100.0,
      successful_deals: 10,
      success_rate: 100.0,
      average_cycle_days: 15.0,
      report_generated_at: expect.any(String)
    });

    expect(report.deviation_patterns).toHaveLength(0);
    expect(report.deviation_score).toBe(0.0);
    expect(report.process_adherence_rate).toBe(100.0);
  });
});