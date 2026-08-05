import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1238
  test('データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 各処理ステップが監査記録に残される', async () => {
    fetchMock.resetMocks();

    const extract_period_start = '2024-01-01';
    const extract_period_end = '2024-01-31';
    const expected_total_records = 100;
    const expected_quality_score_initial = 95.5;
    const expected_defect_count = 3;
    const expected_duplicate_count = 5;
    const expected_duplicate_confidence = 0.92;
    const expected_applied_rules = 6;
    const expected_normalized_record_count = 100;
    const expected_quality_score_final = 98.7;
    const expected_registered_record_count = 100;
    const target_system = 'SALES_ANALYSIS_SYSTEM';

    // Mock responses for each step
    // Step 1: START event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        audit_event: {
          event_id: 'evt_start_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'START',
          status: 'INITIATED',
          timestamp: '2024-01-15T09:00:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 2: DATA_EXTRACTION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        extracted_records: expected_total_records,
        audit_event: {
          event_id: 'evt_extract_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'DATA_EXTRACTION',
          record_count: expected_total_records,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:05:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 3: FORMAT_VALIDATION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        audit_event: {
          event_id: 'evt_validate_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'FORMAT_VALIDATION',
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:10:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 4: QUALITY_ASSESSMENT event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        quality_score: expected_quality_score_initial,
        defect_count: expected_defect_count,
        audit_event: {
          event_id: 'evt_quality_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'QUALITY_ASSESSMENT',
          quality_score: expected_quality_score_initial,
          defect_count: expected_defect_count,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:15:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 5: DUPLICATE_DETECTION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        duplicate_count: expected_duplicate_count,
        confidence: expected_duplicate_confidence,
        audit_event: {
          event_id: 'evt_duplicate_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'DUPLICATE_DETECTION',
          duplicate_count: expected_duplicate_count,
          confidence: expected_duplicate_confidence,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:20:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 6: DATA_CLEANING IN_PROGRESS event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        audit_event: {
          event_id: 'evt_cleaning_start_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'DATA_CLEANING',
          applied_rules: expected_applied_rules,
          status: 'IN_PROGRESS',
          timestamp: '2024-01-15T09:25:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 7: DATA_CLEANING COMPLETED event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        normalized_record_count: expected_normalized_record_count,
        audit_event: {
          event_id: 'evt_cleaning_end_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'DATA_CLEANING',
          normalized_record_count: expected_normalized_record_count,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:30:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 8: QUALITY_REVALIDATION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        final_quality_score: expected_quality_score_final,
        audit_event: {
          event_id: 'evt_revalidate_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'QUALITY_REVALIDATION',
          quality_score: expected_quality_score_final,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:35:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 9: SYSTEM_REGISTRATION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        registered_record_count: expected_registered_record_count,
        audit_event: {
          event_id: 'evt_register_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'SYSTEM_REGISTRATION',
          registered_record_count: expected_registered_record_count,
          target_system: target_system,
          status: 'COMPLETED',
          timestamp: '2024-01-15T09:40:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    // Step 10: COMPLETION event
    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        audit_event: {
          event_id: 'evt_completion_001',
          agent_id: 'agent_tx1_imp1_001',
          action_type: 'COMPLETION',
          total_processed_records: expected_total_records,
          status: 'SUCCEEDED',
          execution_time_ms: 600000,
          timestamp: '2024-01-15T09:45:00Z',
          execution_context_id: 'exec_ctx_20240115_001',
        },
      }),
      { status: 200 }
    );

    const result = await runTx1Imp1Agent({
      extract_period_start,
      extract_period_end,
    });

    // Assertions for overall result
    expect(result.success).toBe(true);
    expect(result.total_audit_events).toBeGreaterThanOrEqual(10);
    expect(result.agent_id).toBe('agent_tx1_imp1_001');
    expect(result.execution_context_id).toBe('exec_ctx_20240115_001');

    // Assertions for audit events
    const audit_events = result.audit_events;
    expect(audit_events).toBeDefined();
    expect(Array.isArray(audit_events)).toBe(true);

    // Verify START event
    const start_event = audit_events.find(
      (e: any) => e.action_type === 'START'
    );
    expect(start_event).toBeDefined();
    expect(start_event.status).toBe('INITIATED');
    expect(start_event.timestamp).toBe('2024-01-15T09:00:00Z');
    expect(start_event.agent_id).toBe('agent_tx1_imp1_001');
    expect(start_event.execution_context_id).toBe('exec_ctx_20240115_001');

    // Verify DATA_EXTRACTION event
    const extraction_event = audit_events.find(
      (e: any) => e.action_type === 'DATA_EXTRACTION'
    );
    expect(extraction_event).toBeDefined();
    expect(extraction_event.record_count).toBe(expected_total_records);
    expect(extraction_event.status).toBe('COMPLETED');
    expect(extraction_event.timestamp).toBe('2024-01-15T09:05:00Z');

    // Verify FORMAT_VALIDATION event
    const validation_event = audit_events.find(
      (e: any) => e.action_type === 'FORMAT_VALIDATION'
    );
    expect(validation_event).toBeDefined();
    expect(validation_event.status).toBe('COMPLETED');
    expect(validation_event.timestamp).toBe('2024-01-15T09:10:00Z');

    // Verify QUALITY_ASSESSMENT event
    const quality_event = audit_events.find(
      (e: any) => e.action_type === 'QUALITY_ASSESSMENT'
    );
    expect(quality_event).toBeDefined();
    expect(quality_event.quality_score).toBe(expected_quality_score_initial);
    expect(quality_event.defect_count).toBe(expected_defect_count);
    expect(quality_event.status).toBe('COMPLETED');
    expect(quality_event.timestamp).toBe('2024-01-15T09:15:00Z');

    // Verify DUPLICATE_DETECTION event
    const duplicate_event = audit_events.find(
      (e: any) => e.action_type === 'DUPLICATE_DETECTION'
    );
    expect(duplicate_event).toBeDefined();
    expect(duplicate_event.duplicate_count).toBe(expected_duplicate_count);
    expect(duplicate_event.confidence).toBe(expected_duplicate_confidence);
    expect(duplicate_event.status).toBe('COMPLETED');
    expect(duplicate_event.timestamp).toBe('2024-01-15T09:20:00Z');

    // Verify DATA_CLEANING IN_PROGRESS event
    const cleaning_start_event = audit_events.find(
      (e: any) =>
        e.action_type === 'DATA_CLEANING' && e.status === 'IN_PROGRESS'
    );
    expect(cleaning_start_event).toBeDefined();
    expect(cleaning_start_event.applied_rules).toBe(expected_applied_rules);
    expect(cleaning_start_event.timestamp).toBe('2024-01-15T09:25:00Z');

    // Verify DATA_CLEANING COMPLETED event
    const cleaning_end_event = audit_events.find(
      (e: any) =>
        e.action_type === 'DATA_CLEANING' && e.status === 'COMPLETED'
    );
    expect(cleaning_end_event).toBeDefined();
    expect(cleaning_end_event.normalized_record_count).toBe(
      expected_normalized_record_count
    );
    expect(cleaning_end_event.timestamp).toBe('2024-01-15T09:30:00Z');

    // Verify QUALITY_REVALIDATION event
    const revalidation_event = audit_events.find(
      (e: any) => e.action_type === 'QUALITY_REVALIDATION'
    );
    expect(revalidation_event).toBeDefined();
    expect(revalidation_event.quality_score).toBe(expected_quality_score_final);
    expect(revalidation_event.status).toBe('COMPLETED');
    expect(revalidation_event.timestamp).toBe('2024-01-15T09:35:00Z');

    // Verify SYSTEM_REGISTRATION event
    const registration_event = audit_events.find(
      (e: any) => e.action_type === 'SYSTEM_REGISTRATION'
    );
    expect(registration_event).toBeDefined();
    expect(registration_event.registered_record_count).toBe(
      expected_registered_record_count
    );
    expect(registration_event.target_system).toBe(target_system);
    expect(registration_event.status).toBe('COMPLETED');
    expect(registration_event.timestamp).toBe('2024-01-15T09:40:00Z');

    // Verify COMPLETION event
    const completion_event = audit_events.find(
      (e: any) => e.action_type === 'COMPLETION'
    );
    expect(completion_event).toBeDefined();
    expect(completion_event.total_processed_records).toBe(
      expected_total_records
    );
    expect(completion_event.status).toBe('SUCCEEDED');
    expect(completion_event.execution_time_ms).toBe(600000);
    expect(completion_event.timestamp).toBe('2024-01-15T09:45:00Z');

    // Verify all events have required audit fields
    audit_events.forEach((event: any) => {
      expect(event.agent_id).toBeDefined();
      expect(event.agent_id).toBe('agent_tx1_imp1_001');
      expect(event.execution_context_id).toBeDefined();
      expect(event.execution_context_id).toBe('exec_ctx_20240115_001');
      expect(event.timestamp).toBeDefined();
      expect(typeof event.timestamp).toBe('string');
      expect(event.action_type).toBeDefined();
      expect(event.status).toBeDefined();
    });

    // Verify causal relationship through execution_context_id
    const unique_contexts = new Set(
      audit_events.map((e: any) => e.execution_context_id)
    );
    expect(unique_contexts.size).toBe(1);
    expect([...unique_contexts][0]).toBe('exec_ctx_20240115_001');
  });
});