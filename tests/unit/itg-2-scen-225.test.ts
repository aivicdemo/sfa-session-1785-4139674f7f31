import { convertProcessStandardToDraft } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - プロセス標準書ドラフト承認待ち時のシステム要件変換', () => {
  // SCEN-225
  test('プロセス標準書ドラフトが承認待ち状態のとき、システム要件への変換が開始される', () => {
    // Arrange
    const draft_id = 'DRAFT-20240115-001';
    const draft_title = '営業初回接触プロセス';
    const draft_status_before = 'draft';
    const draft_status_approval_pending = 'approval_pending';
    const conversion_process_id = 'CONV-20240115-001';
    const conversion_start_timestamp = new Date('2024-01-15T11:00:00Z');
    const conversion_status_expected = 'in_progress';
    const audit_log_timestamp = new Date('2024-01-15T11:00:00Z');
    const audit_log_event_type = 'conversion_started';

    const process_draft_input = {
      draft_id,
      title: draft_title,
      description: '初回接触時の営業プロセスを標準化',
      process_steps: [
        {
          step_number: 1,
          step_name: '初回接触',
          decision_criteria: '顧客企業規模（従業員数）',
          data_items: ['company_name', 'employee_count', 'industry']
        },
        {
          step_number: 2,
          step_name: '提案',
          decision_criteria: '顧客ニーズ適合度',
          data_items: ['customer_need', 'proposal_content', 'budget']
        }
      ],
      status: draft_status_approval_pending,
      status_changed_at: conversion_start_timestamp
    };

    // Act
    const result = convertProcessStandardToDraft(process_draft_input);

    // Assert
    expect(result).toEqual({
      draft_id,
      conversion_process_id: expect.any(String),
      conversion_status: conversion_status_expected,
      system_requirements: expect.objectContaining({
        system_id: 'sales_process_audit_system',
        requirement_items: expect.arrayContaining([
          expect.objectContaining({
            requirement_id: expect.any(String),
            requirement_type: 'data_validation',
            target_field: 'employee_count',
            validation_rule: 'numeric'
          }),
          expect.objectContaining({
            requirement_id: expect.any(String),
            requirement_type: 'decision_rule',
            decision_name: '初回接触判定',
            decision_logic: 'company_size_based'
          })
        ]),
        total_requirements: expect.any(Number)
      }),
      audit_log: {
        timestamp: expect.any(Date),
        draft_id,
        conversion_process_id: expect.any(String),
        event_type: audit_log_event_type,
        executed_by_system: 'sales_quality_engine',
        status_transition: {
          from_status: draft_status_before,
          to_status: draft_status_approval_pending
        }
      }
    });

    expect(result.conversion_status).toBe(conversion_status_expected);
    expect(result.audit_log.timestamp).toEqual(expect.any(Date));
    expect(result.audit_log.draft_id).toBe(draft_id);
    expect(result.system_requirements.total_requirements).toBeGreaterThan(0);
  });
});