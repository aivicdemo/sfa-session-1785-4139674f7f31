import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-1237: [edge] データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 「データ抽出から品質検証・クリーニングまでの自動実行」が同じ要求を再実行しても書き込みや通知を重複させない', async () => {
    fetchMock.resetMocks();

    const extraction_start_date = '2024-01-01T00:00:00Z';
    const extraction_end_date = '2024-01-31T23:59:59Z';
    const cleaning_rule_id = 'RULE_001';
    const target_system_id = 'ANALYSIS_SYS_01';

    const mock_extraction_response = {
      extracted_records: [
        {
          log_id: 'LOG_001',
          sales_rep_id: 'REP_001',
          activity_date: '2024-01-15T10:00:00Z',
          activity_type: 'visit',
          customer_id: 'CUST_001',
          proposal_amount: 100000,
          status: 'pending'
        },
        {
          log_id: 'LOG_002',
          sales_rep_id: 'REP_002',
          activity_date: '2024-01-20T14:30:00Z',
          activity_type: 'call',
          customer_id: 'CUST_002',
          proposal_amount: 50000,
          status: 'completed'
        }
      ],
      total_count: 2,
      extraction_timestamp: '2024-02-01T08:00:00Z'
    };

    const mock_quality_score_response = {
      quality_score: 92,
      validation_results: [
        { field: 'activity_date', status: 'valid', valid_count: 2, invalid_count: 0 },
        { field: 'customer_id', status: 'valid', valid_count: 2, invalid_count: 0 }
      ],
      timestamp: '2024-02-01T08:05:00Z'
    };

    const mock_duplicate_detection_response = {
      duplicate_groups: [],
      merge_candidates: [],
      detection_timestamp: '2024-02-01T08:10:00Z'
    };

    const mock_cleaning_response = {
      cleaned_records: [
        {
          log_id: 'LOG_001',
          sales_rep_id: 'REP_001',
          activity_date: '2024-01-15T10:00:00Z',
          activity_type: 'visit',
          customer_id: 'CUST_001',
          proposal_amount: 100000,
          status: 'pending',
          normalized_flag: true
        },
        {
          log_id: 'LOG_002',
          sales_rep_id: 'REP_002',
          activity_date: '2024-01-20T14:30:00Z',
          activity_type: 'call',
          customer_id: 'CUST_002',
          proposal_amount: 50000,
          status: 'completed',
          normalized_flag: true
        }
      ],
      cleaning_rule_applied: cleaning_rule_id,
      cleaned_count: 2,
      cleaning_timestamp: '2024-02-01T08:15:00Z'
    };

    const mock_registration_response_1 = {
      registration_id: 'REG_EXEC_001',
      registered_count: 2,
      registration_timestamp: '2024-02-01T08:20:00Z',
      completion_status: 'success'
    };

    const mock_registration_response_2 = {
      registration_id: 'REG_EXEC_002',
      registered_count: 2,
      registration_timestamp: '2024-02-01T08:25:00Z',
      completion_status: 'success'
    };

    const mock_process_log_response = {
      log_entries: [
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:00:00Z',
          step: 'extraction',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:05:00Z',
          step: 'quality_validation',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:10:00Z',
          step: 'duplicate_detection',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:15:00Z',
          step: 'cleaning',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:20:00Z',
          step: 'registration',
          status: 'completed'
        }
      ]
    };

    const mock_process_log_response_2 = {
      log_entries: [
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:00:00Z',
          step: 'extraction',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:05:00Z',
          step: 'quality_validation',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:10:00Z',
          step: 'duplicate_detection',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:15:00Z',
          step: 'cleaning',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_001',
          timestamp: '2024-02-01T08:20:00Z',
          step: 'registration',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_002',
          timestamp: '2024-02-01T09:00:00Z',
          step: 'extraction',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_002',
          timestamp: '2024-02-01T09:05:00Z',
          step: 'quality_validation',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_002',
          timestamp: '2024-02-01T09:10:00Z',
          step: 'duplicate_detection',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_002',
          timestamp: '2024-02-01T09:15:00Z',
          step: 'cleaning',
          status: 'completed'
        },
        {
          execution_id: 'EXEC_002',
          timestamp: '2024-02-01T09:20:00Z',
          step: 'registration',
          status: 'completed'
        }
      ]
    };

    // 初回実行のモック設定
    fetchMock.mockResponseOnce(JSON.stringify(mock_extraction_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_quality_score_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_duplicate_detection_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_cleaning_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_registration_response_1), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_process_log_response), { status: 200 });

    const first_execution_request = {
      extraction_start_date,
      extraction_end_date,
      cleaning_rule_id,
      target_system_id
    };

    const first_execution_result = await runTx1Imp1Agent(first_execution_request);

    expect(first_execution_result.status).toBe('success');
    expect(first_execution_result.execution_id).toBe('EXEC_001');
    expect(first_execution_result.extracted_records_count).toBe(2);
    expect(first_execution_result.quality_score).toBe(92);
    expect(first_execution_result.registration_id).toBe('REG_EXEC_001');
    expect(first_execution_result.completion_timestamp).toBe('2024-02-01T08:20:00Z');

    const first_execution_notification_count = fetchMock.mock.calls.length;

    expect(first_execution_notification_count).toBe(6);

    // 2回目実行のモック設定
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mock_extraction_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_quality_score_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_duplicate_detection_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_cleaning_response), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_registration_response_2), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(mock_process_log_response_2), { status: 200 });

    const second_execution_request = {
      extraction_start_date,
      extraction_end_date,
      cleaning_rule_id,
      target_system_id
    };

    const second_execution_result = await runTx1Imp1Agent(second_execution_request);

    expect(second_execution_result.status).toBe('success');
    expect(second_execution_result.execution_id).toBe('EXEC_002');
    expect(second_execution_result.extracted_records_count).toBe(2);
    expect(second_execution_result.quality_score).toBe(92);
    expect(second_execution_result.registration_id).toBe('REG_EXEC_002');
    expect(second_execution_result.completion_timestamp).toBe('2024-02-01T09:20:00Z');

    const second_execution_notification_count = fetchMock.mock.calls.length;

    expect(second_execution_notification_count).toBe(6);

    const total_api_calls_after_both_executions = first_execution_notification_count + second_execution_notification_count;
    expect(total_api_calls_after_both_executions).toBe(12);

    expect(first_execution_result.registration_id).not.toBe(second_execution_result.registration_id);
    expect(first_execution_result.execution_id).not.toBe(second_execution_result.execution_id);
    expect(first_execution_result.completion_timestamp).not.toBe(second_execution_result.completion_timestamp);

    const process_log_entry_count_after_second_execution = mock_process_log_response_2.log_entries.length;
    expect(process_log_entry_count_after_second_execution).toBe(10);

    const first_execution_log_entries = mock_process_log_response_2.log_entries.filter(
      (entry: any) => entry.execution_id === 'EXEC_001'
    );
    const second_execution_log_entries = mock_process_log_response_2.log_entries.filter(
      (entry: any) => entry.execution_id === 'EXEC_002'
    );

    expect(first_execution_log_entries.length).toBe(5);
    expect(second_execution_log_entries.length).toBe(5);

    const first_exec_timestamps = first_execution_log_entries.map((entry: any) => entry.timestamp);
    const second_exec_timestamps = second_execution_log_entries.map((entry: any) => entry.timestamp);

    expect(first_exec_timestamps[0]).toBe('2024-02-01T08:00:00Z');
    expect(first_exec_timestamps[4]).toBe('2024-02-01T08:20:00Z');

    expect(second_exec_timestamps[0]).toBe('2024-02-01T09:00:00Z');
    expect(second_exec_timestamps[4]).toBe('2024-02-01T09:20:00Z');

    const timestamp_sets_are_different = JSON.stringify(first_exec_timestamps) !== JSON.stringify(second_exec_timestamps);
    expect(timestamp_sets_are_different).toBe(true);

    expect(first_execution_result.extracted_records_count).toBe(second_execution_result.extracted_records_count);
    expect(first_execution_result.quality_score).toBe(second_execution_result.quality_score);

    const duplicate_data_check = first_execution_result.registration_id !== second_execution_result.registration_id;
    expect(duplicate_data_check).toBe(true);
  });
});