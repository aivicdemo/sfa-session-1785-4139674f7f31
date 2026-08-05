import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateCoachingPriorityWithDedupHandling } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-303
  test('営業担当者の行動パターン分析結果に重複データが含まれる場合、改善指導対象者判定時に重複が排除される', () => {
    const analyzed_sales_reps = [
      {
        employee_id: 'EMP001',
        employee_name: '田中太郎',
        proposal_count_monthly: 4,
        proposal_score: 65,
        followup_interval_days: 12,
        customer_contact_frequency: 2.1,
        process_compliance_rate: 0.72,
        conversion_rate: 0.18,
        deviation_score: 28,
        coaching_priority_base: 'HIGH'
      },
      {
        employee_id: 'EMP001',
        employee_name: '田中太郎',
        proposal_count_monthly: 4,
        proposal_score: 65,
        followup_interval_days: 12,
        customer_contact_frequency: 2.1,
        process_compliance_rate: 0.72,
        conversion_rate: 0.18,
        deviation_score: 28,
        coaching_priority_base: 'HIGH'
      },
      {
        employee_id: 'EMP002',
        employee_name: '佐藤花子',
        proposal_count_monthly: 3,
        proposal_score: 58,
        followup_interval_days: 14,
        customer_contact_frequency: 1.8,
        process_compliance_rate: 0.65,
        conversion_rate: 0.15,
        deviation_score: 35,
        coaching_priority_base: 'HIGH'
      },
      {
        employee_id: 'EMP003',
        employee_name: '鈴木次郎',
        proposal_count_monthly: 8,
        proposal_score: 82,
        followup_interval_days: 7,
        customer_contact_frequency: 3.5,
        process_compliance_rate: 0.91,
        conversion_rate: 0.32,
        deviation_score: 8,
        coaching_priority_base: 'MEDIUM'
      }
    ];

    const compliance_threshold = 0.75;
    const conversion_threshold = 0.25;
    const deviation_threshold = 20;

    const result = calculateCoachingPriorityWithDedupHandling(
      analyzed_sales_reps,
      compliance_threshold,
      conversion_threshold,
      deviation_threshold
    );

    expect(result.coaching_target_employees).toHaveLength(2);

    const employee_ids_in_result = result.coaching_target_employees.map(emp => emp.employee_id);
    expect(employee_ids_in_result).toEqual(['EMP001', 'EMP002']);

    const emp001_count = employee_ids_in_result.filter(id => id === 'EMP001').length;
    expect(emp001_count).toBe(1);

    const emp002_in_result = result.coaching_target_employees.find(emp => emp.employee_id === 'EMP002');
    expect(emp002_in_result).toBeDefined();
    expect(emp002_in_result?.employee_id).toBe('EMP002');
    expect(emp002_in_result?.employee_name).toBe('佐藤花子');

    const emp003_in_result = result.coaching_target_employees.find(emp => emp.employee_id === 'EMP003');
    expect(emp003_in_result).toBeUndefined();

    expect(result.deduplication_count).toBe(1);

    expect(result.coaching_target_employees[0]).toHaveProperty('priority_score');
    expect(result.coaching_target_employees[0]).toHaveProperty('coaching_reason');
    expect(result.coaching_target_employees[0]).toHaveProperty('priority_rank');
  });
});