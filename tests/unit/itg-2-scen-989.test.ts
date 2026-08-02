import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordPurchaseResultAndIntegrateData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-989
  test('データ不整合ログが1件記録される場合に正しく追跡される', async () => {
    const purchase_result_id = 'PUR-20240115-001';
    const trace_id = 'TRACE-20240115-ABC123';
    const timestamp_recorded = new Date('2024-01-15T11:00:00Z');
    const customer_id = 'CUST-5001';
    const expected_amount = 150000;
    const actual_amount = 150001;
    const mismatch_field_name = 'contract_amount';

    const input_data = {
      purchase_result_id: purchase_result_id,
      trace_id: trace_id,
      timestamp_recorded: timestamp_recorded,
      customer_id: customer_id,
      expected_amount: expected_amount,
      actual_amount: actual_amount,
    };

    const expected_log_entry = {
      data_mismatch_log_id: expect.any(String),
      purchase_result_id: purchase_result_id,
      trace_id: trace_id,
      field_name: mismatch_field_name,
      expected_value: expected_amount.toString(),
      actual_value: actual_amount.toString(),
      detected_at: timestamp_recorded.toISOString(),
      is_traceable: true,
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: true,
        mismatch_count: 1,
        mismatch_details: [
          {
            field_name: mismatch_field_name,
            expected_value: expected_amount,
            actual_value: actual_amount,
          },
        ],
      }),
      { status: 200 }
    );

    const result = await recordPurchaseResultAndIntegrateData(input_data);

    expect(result.mismatch_log_count).toBe(1);
    expect(result.mismatch_logs).toHaveLength(1);

    const recorded_log = result.mismatch_logs[0];
    expect(recorded_log.purchase_result_id).toBe(purchase_result_id);
    expect(recorded_log.trace_id).toBe(trace_id);
    expect(recorded_log.field_name).toBe(mismatch_field_name);
    expect(recorded_log.expected_value).toBe(expected_amount.toString());
    expect(recorded_log.actual_value).toBe(actual_amount.toString());
    expect(recorded_log.detected_at).toBe(timestamp_recorded.toISOString());
    expect(recorded_log.is_traceable).toBe(true);
    expect(recorded_log.data_mismatch_log_id).toBeDefined();
  });
});