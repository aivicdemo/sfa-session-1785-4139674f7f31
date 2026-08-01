import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-106
  test('プロセス標準書が営業部長承認待ち状態のときシステム要件変換処理が実行可能である', () => {
    const process_standard_id = 'PS-2024-001';
    const approval_status = 'pending_division_head';
    const draft_status = 'draft';
    const execution_started_at = new Date('2024-01-15T10:00:00Z');
    const execution_completed_at = new Date('2024-01-15T10:05:00Z');
    const system_requirement_document_id = 'SYS-REQ-2024-001';

    const result = convertProcessStandardToSystemRequirements({
      process_standard_id: process_standard_id,
      approval_status: approval_status,
      draft_status: draft_status,
      execution_started_at: execution_started_at,
      execution_completed_at: execution_completed_at
    });

    expect(result.conversion_status).toBe('conversion_completed');
    expect(result.process_standard_id).toBe(process_standard_id);
    expect(result.system_requirement_document_id).toBe(system_requirement_document_id);
    expect(result.conversion_log).toEqual({
      process_started_at: execution_started_at,
      process_completed_at: execution_completed_at,
      target_process_standard_id: process_standard_id,
      generated_document_id: system_requirement_document_id
    });
  });
});