import { runTx12Imp1Agent, Tx12Imp1AgentInput, Tx12Imp1AgentOutput } from '../../src/logic/it-1';

// Mock dependencies
jest.mock('../../src/db/connection', () => ({
  getConnection: jest.fn(),
}));

jest.mock('../../src/agents/tx-12-imp-1/orchestrator', () => ({
  runTx12Imp1Agent: jest.fn(),
}));

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  // SCEN-1325
  test('AIエージェント - 営業データ分析から乖離検出までの自律実行が途中失敗時に完了済みの副作用を巻き戻す', async () => {
    // Setup: Initial database state
    const triggerId = 'trig-20240115-monthly-001';
    const analysisStartTime = new Date('2024-01-15T09:00:00Z');
    const targetMonthYear = '2024-01';

    const mockInitialState = {
      salespeople_count: 5,
      quality_score: 0.98,
      historical_months: 12,
      process_definition_status: 'available',
    };

    const mockQualityCheckResult = {
      id: 'qc-result-20240115-001',
      trigger_id: triggerId,
      status: 'completed',
      missing_values: 0,
      format_errors: 0,
      duplicate_count: 0,
      quality_score: 0.98,
      timestamp: analysisStartTime.toISOString(),
      created_at: new Date('2024-01-15T09:05:00Z').toISOString(),
    };

    const mockBehaviorPatternResult = {
      id: 'bp-result-20240115-001',
      trigger_id: triggerId,
      status: 'completed',
      salesperson_id: 'sales-001',
      contact_frequency: 5.2,
      proposal_count: 3,
      followup_interval_days: 3.5,
      timestamp: new Date('2024-01-15T09:15:00Z').toISOString(),
      created_at: new Date('2024-01-15T09:15:00Z').toISOString(),
    };

    const mockProcessDeviationResult = {
      id: 'pd-result-20240115-001',
      trigger_id: triggerId,
      status: 'completed',
      salesperson_id: 'sales-001',
      process_stage: 'initial_contact',
      deviation_percentage: 12.5,
      timestamp: new Date('2024-01-15T09:25:00Z').toISOString(),
      created_at: new Date('2024-01-15T09:25:00Z').toISOString(),
    };

    const mockAuditLogEntry = {
      id: 'audit-20240115-001',
      timestamp: analysisStartTime.toISOString(),
      trigger_id: triggerId,
      failed_step: 'sales_results_correlation_analysis',
      error_message: 'API timeout during correlation computation',
      rollback_objects: [
        mockQualityCheckResult.id,
        mockBehaviorPatternResult.id,
        mockProcessDeviationResult.id,
      ],
      rollback_completed_at: new Date('2024-01-15T09:30:00Z').toISOString(),
    };

    // Stage 1: Data extraction phase succeeds
    fetchMock.mockResponseOnce(
      JSON.stringify({
        trigger_id: triggerId,
        target_month: targetMonthYear,
        extraction_status: 'success',
        records_count: 245,
        extracted_at: new Date('2024-01-15T09:02:00Z').toISOString(),
      }),
      { status: 200 },
    );

    // Stage 2: Quality check phase succeeds
    fetchMock.mockResponseOnce(
      JSON.stringify({
        quality_check_result: mockQualityCheckResult,
        status: 'completed',
      }),
      { status: 200 },
    );

    // Stage 3: Behavior pattern analysis succeeds
    fetchMock.mockResponseOnce(
      JSON.stringify({
        behavior_pattern_results: [mockBehaviorPatternResult],
        status: 'completed',
      }),
      { status: 200 },
    );

    // Stage 4: Process deviation analysis succeeds
    fetchMock.mockResponseOnce(
      JSON.stringify({
        process_deviation_results: [mockProcessDeviationResult],
        status: 'completed',
      }),
      { status: 200 },
    );

    // Stage 5: Sales results correlation fails with error
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'timeout',
        message: 'API timeout during correlation computation',
        step: 'sales_results_correlation_analysis',
      }),
      { status: 504 },
    );

    // Rollback phase: cleanup of partial artifacts
    fetchMock.mockResponseOnce(
      JSON.stringify({
        rollback_status: 'completed',
        deleted_records: [
          mockQualityCheckResult.id,
          mockBehaviorPatternResult.id,
          mockProcessDeviationResult.id,
        ],
        rollback_completed_at: mockAuditLogEntry.rollback_completed_at,
      }),
      { status: 200 },
    );

    // Audit log recording
    fetchMock.mockResponseOnce(
      JSON.stringify({
        audit_log_entry: mockAuditLogEntry,
        status: 'logged',
      }),
      { status: 200 },
    );

    // Prepare agent input
    const agentInput: Tx12Imp1AgentInput = {
      trigger_id: triggerId,
      trigger_type: 'monthly_sales_meeting',
      target_month: targetMonthYear,
      initiated_at: analysisStartTime.toISOString(),
      initiated_by_role: 'sales_manager',
    };

    // Execute agent with partial failure scenario
    const agentOutput: Tx12Imp1AgentOutput = await runTx12Imp1Agent(agentInput);

    // Verification 1: Agent returned Failed status with error details
    expect(agentOutput.status).toBe('Failed');
    expect(agentOutput.failed_step).toBe('sales_results_correlation_analysis');
    expect(agentOutput.error_message).toMatch(/timeout/i);

    // Verification 2: Rollback artifacts are listed
    expect(agentOutput.rollback_artifacts).toEqual([
      mockQualityCheckResult.id,
      mockBehaviorPatternResult.id,
      mockProcessDeviationResult.id,
    ]);

    // Verification 3: Audit log contains required fields
    expect(agentOutput.audit_log_id).toBe(mockAuditLogEntry.id);
    expect(agentOutput.audit_log_entry).toMatchObject({
      trigger_id: triggerId,
      failed_step: 'sales_results_correlation_analysis',
      error_message: expect.stringMatching(/timeout/i),
    });

    // Verification 4: Rollback completion timestamp is recorded
    expect(agentOutput.rollback_completed_at).toBe(
      mockAuditLogEntry.rollback_completed_at,
    );

    // Verification 5: No report was generated (stops before completion)
    expect(agentOutput.report_id).toBeUndefined();
    expect(agentOutput.report_generated_at).toBeUndefined();

    // Verification 6: Intermediate artifacts were NOT retained
    expect(agentOutput.quality_check_result_id).toBeUndefined();
    expect(agentOutput.behavior_pattern_result_ids).toBeUndefined();
    expect(agentOutput.process_deviation_result_ids).toBeUndefined();

    // Verification 7: Transaction control metadata confirms rollback
    expect(agentOutput.transaction_rollback_status).toBe('completed');
    expect(agentOutput.transaction_rollback_details).toMatchObject({
      phase_rolledback: 'sales_results_correlation_analysis',
      prior_phases_cleaned: [
        'data_extraction',
        'quality_check',
        'behavior_pattern_analysis',
        'process_deviation_analysis',
      ],
    });

    // Verification 8: API calls were made in correct order (7 total)
    expect(fetchMock.mock.calls.length).toBe(7);

    // Verify call sequence
    expect(fetchMock.mock.calls[0][0]).toMatch(/extract/i);
    expect(fetchMock.mock.calls[1][0]).toMatch(/quality_check/i);
    expect(fetchMock.mock.calls[2][0]).toMatch(/behavior_pattern/i);
    expect(fetchMock.mock.calls[3][0]).toMatch(/process_deviation/i);
    expect(fetchMock.mock.calls[4][0]).toMatch(/correlation/i);
    expect(fetchMock.mock.calls[5][0]).toMatch(/rollback/i);
    expect(fetchMock.mock.calls[6][0]).toMatch(/audit/i);
  });
});