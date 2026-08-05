import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { runTx1Imp1Agent } from '../../src/agents/tx-1-imp-1/orchestrator';
import type { Tx1Imp1AiClient } from '../../src/agents/tx-1-imp-1/ai-client';

fetchMock.enableMocks();

describe('tx_1_imp_1: データ抽出から品質検証・クリーニングまでの自動実行', () => {
  let aiClient: Tx1Imp1AiClient;
  let processLogStorage: Map<string, unknown>;

  beforeEach(() => {
    fetchMock.resetMocks();
    processLogStorage = new Map();

    aiClient = {
      getNextAction: jest.fn(async (state: unknown) => {
        const current_state = state as Record<string, unknown>;
        const current_step = current_state?.current_step as string | undefined;

        if (current_step === 'verify_normalized_data_quality') {
          return {
            action: 'verify_normalized_data_quality',
            status: 'completed',
            verification_result: {
              quality_score: 95,
              completeness_percentage: 99,
              format_compliance_rate: 100,
              anomaly_count: 0,
              duplicate_record_count: 0,
              timestamp: '2024-01-31T23:59:59Z',
            },
            next_step: 'register_to_analysis_system',
          };
        }

        return {
          action: 'extract_logs',
          status: 'completed',
          extracted_records: 100,
          extraction_period_start: '2024-01-01T00:00:00Z',
          extraction_period_end: '2024-01-31T23:59:59Z',
          next_step: 'verify_extraction_completeness',
        };
      }),
    };
  });

  afterEach(() => {
    fetchMock.resetMocks();
    processLogStorage.clear();
  });

  // SCEN-1227
  test('正規化済みデータの品質再検証が契約どおり実行される', async () => {
    const extraction_start_date = '2024-01-01';
    const extraction_end_date = '2024-01-31';
    const target_sales_rep_ids = ['rep_001', 'rep_002', 'rep_003'];

    const extracted_logs = Array.from({ length: 100 }, (_, i) => ({
      log_id: `log_${i + 1}`,
      sales_rep_id: target_sales_rep_ids[i % 3],
      activity_date: new Date('2024-01-15').toISOString(),
      activity_type: 'visit',
      customer_id: `cust_${i + 1}`,
      description: `Activity ${i + 1}`,
    }));

    const normalized_data = Array.from({ length: 100 }, (_, i) => ({
      log_id: `log_${i + 1}`,
      sales_rep_id: target_sales_rep_ids[i % 3],
      activity_date: new Date('2024-01-15').toISOString(),
      activity_type: 'visit',
      customer_id: `cust_${i + 1}`,
      normalized_description: `Activity ${i + 1} [normalized]`,
      normalization_timestamp: new Date('2024-01-31T12:00:00Z').toISOString(),
    }));

    const verification_result = {
      quality_score: 95,
      completeness_percentage: 99,
      format_compliance_rate: 100,
      anomaly_count: 0,
      duplicate_record_count: 0,
      verification_timestamp: '2024-01-31T23:59:59Z',
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        extracted_records: extracted_logs,
        extraction_period_start: extraction_start_date,
        extraction_period_end: extraction_end_date,
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        completeness: true,
        format_valid: true,
        issues: [],
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        normalized_records: normalized_data,
        rules_applied: 5,
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 'success',
        verification_result,
      }),
      { status: 200 }
    );

    const orchestrator_state = {
      execution_id: 'exec_20240131_001',
      current_step: 'verify_normalized_data_quality',
      extracted_records_count: 100,
      extraction_start: extraction_start_date,
      extraction_end: extraction_end_date,
      normalized_records: normalized_data,
      process_logs: [] as Array<Record<string, unknown>>,
    };

    const result = await runTx1Imp1Agent(
      {
        extraction_start_date,
        extraction_end_date,
        target_sales_rep_ids,
      },
      aiClient,
      processLogStorage
    );

    expect(result).toBeDefined();
    expect(result.current_step).toBe('verify_normalized_data_quality');
    expect(result.verification_status).toBe('completed');

    expect(result.quality_verification).toEqual({
      quality_score: 95,
      completeness_percentage: 99,
      format_compliance_rate: 100,
      anomaly_count: 0,
      duplicate_record_count: 0,
    });

    expect(result.normalized_records_count).toBe(100);

    expect(result.escalation_triggered).toBe(false);

    const verification_logs = Array.from(processLogStorage.values()).filter(
      (log) =>
        (log as Record<string, unknown>)?.step === 'verify_normalized_data_quality'
    );
    expect(verification_logs.length).toBeGreaterThan(0);

    const first_verification_log = verification_logs[0] as Record<string, unknown>;
    expect(first_verification_log.start_time).toBeDefined();
    expect(first_verification_log.end_time).toBeDefined();
    expect(first_verification_log.execution_result).toBe('success');
    expect(
      (first_verification_log.result as Record<string, unknown>)?.anomaly_count
    ).toBe(0);
    expect(
      (first_verification_log.result as Record<string, unknown>)?.duplicate_record_count
    ).toBe(0);

    expect(result.next_step).toBe('register_to_analysis_system');
  });
});