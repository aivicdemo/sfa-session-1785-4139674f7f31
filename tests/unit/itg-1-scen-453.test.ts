import { analyzeActionPatternAndDealResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-453
  test('[normal] 同じ分析を複数回実行した場合、毎回同じ結果が得られる', () => {
    const sales_person_id = 'SP_A_001';
    const analysis_period_months = 3;
    const analysis_type = 'action_pattern_analysis';
    
    const action_data = {
      sales_person_id,
      visits: 25,
      phone_contacts: 18,
      proposal_documents_sent: 12,
    };
    
    const deal_results = {
      sales_person_id,
      closed_deals: 5,
      closed_amount_millions: 2.5,
    };
    
    const analysis_params = {
      sales_person_id,
      period_months: analysis_period_months,
      analysis_type,
    };

    const result1 = analyzeActionPatternAndDealResults(
      action_data,
      deal_results,
      analysis_params
    );

    const result2 = analyzeActionPatternAndDealResults(
      action_data,
      deal_results,
      analysis_params
    );

    const result3 = analyzeActionPatternAndDealResults(
      action_data,
      deal_results,
      analysis_params
    );

    expect(result1.action_score).toBe(75.3);
    expect(result2.action_score).toBe(75.3);
    expect(result3.action_score).toBe(75.3);

    expect(result1.correlation_coefficient).toBe(0.82);
    expect(result2.correlation_coefficient).toBe(0.82);
    expect(result3.correlation_coefficient).toBe(0.82);

    expect(result1.recommended_actions).toEqual(result2.recommended_actions);
    expect(result2.recommended_actions).toEqual(result3.recommended_actions);

    expect(result1.anomaly_flag).toBe(result2.anomaly_flag);
    expect(result2.anomaly_flag).toBe(result3.anomaly_flag);

    expect(result1.analysis_type).toBe(result2.analysis_type);
    expect(result2.analysis_type).toBe(result3.analysis_type);

    expect(result1.sales_person_id).toBe(result2.sales_person_id);
    expect(result2.sales_person_id).toBe(result3.sales_person_id);

    expect(result1.period_months).toBe(result2.period_months);
    expect(result2.period_months).toBe(result3.period_months);
  });
});