import { analyzeProposalAndCustomerPatternConformity } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-713: 提案内容と顧客対応パターンの標準プロセス比較分析 - 提案内容の適合性スコアが合格閾値未満の場合に異常パターンとして検出される', () => {
    const conformity_threshold = 70;
    const actual_conformity_score = 65;

    const proposal_input = {
      proposal_id: 'PROP-20240115-001',
      sales_employee_id: 'EMP-999',
      customer_id: 'CUST-20240115-001',
      proposal_content: 'SaaS solution proposal for IT industry',
      proposed_date: '2024-01-15T09:00:00Z',
      proposal_value: 500000,
    };

    const standard_process_template = {
      industry: 'IT',
      product_category: 'SaaS',
      expected_process_steps: [
        'initial_contact',
        'needs_analysis',
        'proposal_presentation',
        'negotiation',
        'contract_signing',
      ],
      conformity_threshold: conformity_threshold,
    };

    const analysis_result = analyzeProposalAndCustomerPatternConformity(
      proposal_input,
      standard_process_template,
      actual_conformity_score
    );

    expect(analysis_result.is_anomaly_detected).toBe(true);
    expect(analysis_result.detected_patterns).toContain(
      'PATTERN_CONFORMITY_BELOW_THRESHOLD'
    );
    expect(analysis_result.conformity_score_detail.actual_score).toBe(
      actual_conformity_score
    );
    expect(analysis_result.conformity_score_detail.threshold).toBe(
      conformity_threshold
    );
    expect(analysis_result.conformity_score_detail.is_below_threshold).toBe(
      true
    );
  });
});