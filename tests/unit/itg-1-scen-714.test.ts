import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  analyzeProposalPatternConformity,
  type ProposalPatternAnalysisInput,
  type ProposalPatternAnalysisResult,
} from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-714
  test('提案内容の適合性スコアが合格閾値を超過する場合に正常パターンとして判定される', () => {
    const threshold_approval = 70;
    const conformity_score = 75;

    const input: ProposalPatternAnalysisInput = {
      proposal_content: {
        proposal_id: 'PROP-20240115-001',
        customer_id: 'CUST-A001',
        product_category: 'Enterprise Solution',
        proposed_amount: 5000000,
        proposed_terms: 24,
        business_rationale: 'Cost reduction and process optimization',
      },
      customer_response_pattern: 'initial_proposal',
      standard_process_definition: {
        stage_name: 'proposal_submission',
        expected_actions: [
          'send_proposal_document',
          'initial_meeting',
          'requirement_clarification',
        ],
        kpi_targets: {
          response_time_days: 3,
          follow_up_frequency_weekly: 1,
        },
      },
      conformity_threshold: threshold_approval,
    };

    const result: ProposalPatternAnalysisResult = analyzeProposalPatternConformity(input);

    expect(result.judgment_result).toBe('normal_pattern');
    expect(result.judgment_status).toBe('APPROVED');
    expect(result.conformity_score).toBe(conformity_score);
    expect(result.threshold_exceeded_flag).toBe(true);
  });
});