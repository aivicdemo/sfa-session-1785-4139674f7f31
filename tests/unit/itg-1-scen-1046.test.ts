import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import type { SalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  let mockCalculateComplianceScore: jest.Mock;
  let mockCalculateSuccessRate: jest.Mock;
  let mockAnalyzeBehaviorPattern: jest.Mock;

  beforeEach(() => {
    mockCalculateComplianceScore = jest.fn();
    mockCalculateSuccessRate = jest.fn();
    mockAnalyzeBehaviorPattern = jest.fn();

    jest.doMock('../../src/logic/it-1-br-target4-1-1-1', () => ({
      ...jest.requireActual('../../src/logic/it-1-br-target4-1-1-1'),
      calculateComplianceScore: mockCalculateComplianceScore,
      calculateSuccessRate: mockCalculateSuccessRate,
      analyzeBehaviorPattern: mockAnalyzeBehaviorPattern,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  // SCEN-1046
  test('理解度スコアが閾値ちょうど 100% で周知完了判定が真になる', async () => {
    const sales_person_id = 'SP001';
    const compliance_threshold_percent = 100;
    const compliance_score_value = 100;
    const success_rate_value = 75;
    const behavior_patterns = [
      {
        pattern_type: 'initial_contact_frequency',
        value: 1.2,
        deviation_from_standard: 0.2,
      },
      {
        pattern_type: 'proposal_success_rate',
        value: 0.85,
        deviation_from_standard: 0.15,
      },
      {
        pattern_type: 'followup_interval_days',
        value: 3,
        deviation_from_standard: 1,
      },
    ];

    const input_data = {
      sales_person_id: sales_person_id,
      analysis_period_start_date: '2024-01-01',
      analysis_period_end_date: '2024-01-31',
      compliance_threshold_percent: compliance_threshold_percent,
      transaction_records: [
        {
          transaction_id: 'TRX001',
          customer_id: 'CUST001',
          contact_date: '2024-01-05',
          contact_type: 'visit',
          proposal_content: 'Product A - Enterprise License',
          followup_interval_days: 3,
          customer_response: 'positive',
          deal_status: 'won',
        },
        {
          transaction_id: 'TRX002',
          customer_id: 'CUST002',
          contact_date: '2024-01-10',
          contact_type: 'call',
          proposal_content: 'Product B - SMB Package',
          followup_interval_days: 5,
          customer_response: 'neutral',
          deal_status: 'in_progress',
        },
        {
          transaction_id: 'TRX003',
          customer_id: 'CUST003',
          contact_date: '2024-01-20',
          contact_type: 'email',
          proposal_content: 'Product C - Starter Plan',
          followup_interval_days: 2,
          customer_response: 'positive',
          deal_status: 'won',
        },
      ],
      standard_process_steps: [
        {
          step_id: 'STEP001',
          step_name: 'initial_contact',
          target_frequency_per_week: 6,
          expected_completion_days: 7,
        },
        {
          step_id: 'STEP002',
          step_name: 'proposal',
          target_frequency_per_week: 4,
          expected_completion_days: 14,
        },
        {
          step_id: 'STEP003',
          step_name: 'negotiation',
          target_frequency_per_week: 3,
          expected_completion_days: 21,
        },
        {
          step_id: 'STEP004',
          step_name: 'contract',
          target_frequency_per_week: 1,
          expected_completion_days: 30,
        },
      ],
    };

    mockCalculateComplianceScore.mockReturnValue(compliance_score_value);
    mockCalculateSuccessRate.mockReturnValue(success_rate_value);
    mockAnalyzeBehaviorPattern.mockReturnValue(behavior_patterns);

    const report: SalesPersonBehaviorAnalysisReport = await generateSalesPersonBehaviorAnalysisReport(input_data);

    expect(report.compliance_score_percent).toBe(100);
    expect(report.compliance_threshold_percent).toBe(100);
    expect(report.is_awareness_completion_achieved).toBe(true);
    expect(report.success_rate_percent).toBe(75);
    expect(report.behavior_patterns).toHaveLength(3);
    expect(report.behavior_patterns[0]).toEqual({
      pattern_type: 'initial_contact_frequency',
      value: 1.2,
      deviation_from_standard: 0.2,
    });
    expect(report.behavior_patterns[1]).toEqual({
      pattern_type: 'proposal_success_rate',
      value: 0.85,
      deviation_from_standard: 0.15,
    });
    expect(report.behavior_patterns[2]).toEqual({
      pattern_type: 'followup_interval_days',
      value: 3,
      deviation_from_standard: 1,
    });
    expect(report.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});