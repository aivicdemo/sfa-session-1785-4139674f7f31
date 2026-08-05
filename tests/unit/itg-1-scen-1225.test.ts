import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx1Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード - Tx1Imp1Agent', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1225
  test('データ抽出から品質検証・クリーニングまでの自動実行: 顧客情報重複検出とマージ候補提示', async () => {
    const extraction_start_date = '2024-01-01';
    const extraction_end_date = '2024-01-31';
    const extracted_log_count = 100;
    const customer_master_count = 50;
    const cleaning_rules_count = 5;

    const mock_extracted_logs = Array.from({ length: extracted_log_count }, (_, i) => ({
      log_id: `log_${i + 1}`,
      timestamp: `2024-01-${String((i % 31) + 1).padStart(2, '0')}T10:00:00Z`,
      customer_name: i === 0 ? '山田太郎' : i === 44 ? '太郎山田' : `customer_${i}`,
      phone_number: i === 0 ? '090-1111-1111' : i === 44 ? '09011111111' : `080-${String(i).padStart(4, '0')}-0000`,
      email: `customer_${i}@example.com`,
      sales_activity: `activity_${i}`,
    }));

    const mock_customer_master = Array.from({ length: customer_master_count }, (_, i) => ({
      customer_id: `customer_id_${String(i + 1).padStart(3, '0')}`,
      customer_name: i === 0 ? '山田太郎' : i === 44 ? '太郎山田' : `customer_${i}`,
      phone_number: i === 0 ? '090-1111-1111' : i === 44 ? '09011111111' : `080-${String(i).padStart(4, '0')}-0000`,
      email: `customer_${i}@example.com`,
    }));

    const mock_cleaning_rules = [
      { rule_id: 'rule_1', rule_name: 'phone_format', pattern: '\\d{3}-\\d{4}-\\d{4}', replacement: '' },
      { rule_id: 'rule_2', rule_name: 'email_normalize', pattern: '', replacement: '' },
      { rule_id: 'rule_3', rule_name: 'name_trim', pattern: '', replacement: '' },
      { rule_id: 'rule_4', rule_name: 'address_normalize', pattern: '', replacement: '' },
      { rule_id: 'rule_5', rule_name: 'postal_code_format', pattern: '', replacement: '' },
    ];

    const duplicate_detection_rule = {
      rule_id: 'dup_rule_1',
      rule_name: 'customer_match_by_name_and_phone',
      condition: 'customer_name === exact AND phone_number === exact',
      threshold_confidence: 0.85,
    };

    const mock_duplicate_detection_result = {
      duplicates_found: [
        {
          customer_id_1: 'customer_id_001',
          customer_id_2: 'customer_id_045',
          customer_name: '山田太郎',
          phone_number_1: '090-1111-1111',
          phone_number_2: '09011111111',
          match_type: 'exact_name_and_normalized_phone',
          confidence_score: 0.92,
          attribute_differences: [
            { attribute: 'customer_name', value_1: '山田太郎', value_2: '太郎山田', difference_type: 'name_order_reversal' },
            { attribute: 'phone_number', value_1: '090-1111-1111', value_2: '09011111111', difference_type: 'hyphen_format' },
          ],
          recommended_action: 'マージ確認待機',
        },
      ],
    };

    const mock_processing_log = {
      process_log_id: 'plog_001',
      execution_timestamp: '2024-01-15T11:00:00Z',
      process_name: 'tx_1_imp_1_data_extraction_validation_cleaning',
      status: 'completed',
      step_logs: [
        {
          step_id: 'step_1_extract',
          step_name: 'extract_sales_process_logs',
          start_time: '2024-01-15T11:00:00Z',
          end_time: '2024-01-15T11:00:30Z',
          record_count: extracted_log_count,
          status: 'success',
        },
        {
          step_id: 'step_2_validate_completeness',
          step_name: 'validate_data_completeness',
          start_time: '2024-01-15T11:00:30Z',
          end_time: '2024-01-15T11:00:45Z',
          completeness_score: 0.98,
          missing_fields_count: 2,
          status: 'success',
        },
        {
          step_id: 'step_3_calculate_quality_score',
          step_name: 'calculate_data_quality_score',
          start_time: '2024-01-15T11:00:45Z',
          end_time: '2024-01-15T11:01:00Z',
          completeness_score: 0.98,
          format_validity_score: 0.96,
          overall_quality_score: 0.97,
          status: 'success',
        },
        {
          step_id: 'step_4_detect_duplicates',
          step_name: 'detect_customer_duplicates',
          start_time: '2024-01-15T11:01:00Z',
          end_time: '2024-01-15T11:02:15Z',
          duplicates_detected: 1,
          merge_candidates: [
            {
              customer_id_1: 'customer_id_001',
              customer_id_2: 'customer_id_045',
              customer_name_1: '山田太郎',
              customer_name_2: '太郎山田',
              phone_number_1: '090-1111-1111',
              phone_number_2: '09011111111',
              confidence_score: 0.92,
              attribute_differences: 'name_order_reversal, hyphen_format',
            },
          ],
          ai_client_confidence_score: 0.92,
          status: 'success',
        },
        {
          step_id: 'step_5_record_processing_log',
          step_name: 'record_duplicate_detection_log',
          start_time: '2024-01-15T11:02:15Z',
          end_time: '2024-01-15T11:02:25Z',
          log_entries_recorded: 1,
          duplicates_entry: 'customer_name "山田太郎" AND phone_number "090-1111-1111" detected as duplicate',
          merge_candidates_entry: 'merge_candidate: customer_id_001 (customer_name "山田太郎", phone_number "090-1111-1111") AND customer_id_045 (customer_name "太郎山田", phone_number "09011111111") attribute_differences: name_order_reversal, hyphen_format',
          status: 'success',
        },
        {
          step_id: 'step_6_register_to_analysis_system',
          step_name: 'register_duplicate_report_to_analysis_system',
          start_time: '2024-01-15T11:02:25Z',
          end_time: '2024-01-15T11:02:40Z',
          duplicate_report_registration: [
            {
              duplicate_detection_id: 'dup_detect_001',
              detection_datetime: '2024-01-15T11:02:15Z',
              customer_id_1: 'customer_id_001',
              customer_id_2: 'customer_id_045',
              matched_items: 'customer_name, phone_number_normalized',
              confidence_score: 0.92,
              recommended_action: 'マージ確認待機',
              status: 'registered',
            },
          ],
          status: 'success',
        },
        {
          step_id: 'step_7_verify_rollback_snapshot',
          step_name: 'verify_pre_processing_snapshot',
          start_time: '2024-01-15T11:02:40Z',
          end_time: '2024-01-15T11:02:50Z',
          snapshot_id: 'snapshot_pre_dup_detect_001',
          snapshot_data_records: extracted_log_count,
          snapshot_status: 'available_for_rollback',
          status: 'success',
        },
      ],
    };

    const mock_ai_client = {
      detectDuplicates: jest.fn().mockResolvedValue(mock_duplicate_detection_result),
    };

    fetchMock.mockResponses(
      [JSON.stringify(mock_extracted_logs), { status: 200 }],
      [JSON.stringify(mock_customer_master), { status: 200 }],
      [JSON.stringify(mock_cleaning_rules), { status: 200 }],
      [JSON.stringify(duplicate_detection_rule), { status: 200 }],
      [JSON.stringify(mock_processing_log), { status: 200 }],
    );

    const result = await runTx1Imp1Agent({
      extraction_start_date,
      extraction_end_date,
      ai_client: mock_ai_client,
    });

    expect(result.success).toBe(true);
    expect(result.extracted_record_count).toBe(extracted_log_count);
    expect(result.data_quality_score).toBeGreaterThanOrEqual(0.95);
    expect(result.duplicates_detected_count).toBe(1);

    expect(result.duplicate_detection_results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id_1: 'customer_id_001',
          customer_id_2: 'customer_id_045',
          confidence_score: 0.92,
        }),
      ]),
    );

    expect(result.duplicate_detection_results[0].confidence_score).toBe(0.92);
    expect(result.duplicate_detection_results[0].confidence_score).toBeGreaterThanOrEqual(0.85);

    const merge_candidate = result.duplicate_detection_results[0];
    expect(merge_candidate.attribute_differences).toContainEqual(
      expect.objectContaining({
        attribute: 'customer_name',
        difference_type: 'name_order_reversal',
      }),
    );
    expect(merge_candidate.attribute_differences).toContainEqual(
      expect.objectContaining({
        attribute: 'phone_number',
        difference_type: 'hyphen_format',
      }),
    );

    expect(result.processing_log).toBeDefined();
    expect(result.processing_log.status).toBe('completed');
    expect(result.processing_log.step_logs.length).toBe(7);

    const duplicate_detection_step = result.processing_log.step_logs.find(
      (step) => step.step_id === 'step_4_detect_duplicates',
    );
    expect(duplicate_detection_step).toBeDefined();
    expect(duplicate_detection_step.status).toBe('success');
    expect(duplicate_detection_step.duplicates_detected).toBe(1);

    const record_log_step = result.processing_log.step_logs.find((step) => step.step_id === 'step_5_record_processing_log');
    expect(record_log_step).toBeDefined();
    expect(record_log_step.duplicates_entry).toContain('山田太郎');
    expect(record_log_step.duplicates_entry).toContain('090-1111-1111');
    expect(record_log_step.duplicates_entry).toContain('duplicate');
    expect(record_log_step.merge_candidates_entry).toContain('customer_id_001');
    expect(record_log_step.merge_candidates_entry).toContain('customer_id_045');
    expect(record_log_step.merge_candidates_entry).toContain('name_order_reversal');
    expect(record_log_step.merge_candidates_entry).toContain('hyphen_format');

    const register_step = result.processing_log.step_logs.find(
      (step) => step.step_id === 'step_6_register_to_analysis_system',
    );
    expect(register_step).toBeDefined();
    expect(register_step.status).toBe('success');
    expect(register_step.duplicate_report_registration).toHaveLength(1);
    expect(register_step.duplicate_report_registration[0]).toEqual(
      expect.objectContaining({
        duplicate_detection_id: 'dup_detect_001',
        detection_datetime: '2024-01-15T11:02:15Z',
        customer_id_1: 'customer_id_001',
        customer_id_2: 'customer_id_045',
        matched_items: 'customer_name, phone_number_normalized',
        confidence_score: 0.92,
        recommended_action: 'マージ確認待機',
        status: 'registered',
      }),
    );

    const rollback_step = result.processing_log.step_logs.find(
      (step) => step.step_id === 'step_7_verify_rollback_snapshot',
    );
    expect(rollback_step).toBeDefined();
    expect(rollback_step.status).toBe('success');
    expect(rollback_step.snapshot_status).toBe('available_for_rollback');
    expect(rollback_step.snapshot_data_records).toBe(extracted_log_count);

    expect(result.rollback_snapshot_id).toBe('snapshot_pre_dup_detect_001');
    expect(result.registered_duplicate_detection_id).toBe('dup_detect_001');
  });
});