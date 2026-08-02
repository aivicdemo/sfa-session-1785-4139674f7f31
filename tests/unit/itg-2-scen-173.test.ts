import { detectDuplicateCustomersAndClassifyInconsistencies } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・統合判定機能 - 不整合ログのタイプ分類記録', () => {
  // SCEN-173
  test('不整合ログに不整合のタイプ分類が記録される', () => {
    const recorded_logs: Array<{
      inconsistency_type: string;
      customer_data: Record<string, unknown>;
      timestamp: string;
    }> = [];

    const mock_log_recorder = (
      inconsistency_type: string,
      customer_data: Record<string, unknown>,
      timestamp: string
    ): void => {
      recorded_logs.push({
        inconsistency_type,
        customer_data,
        timestamp,
      });
    };

    const inconsistency_dataset = [
      {
        customer_id: 'CUST_001',
        phone_number: '09012345',
        expected_type: 'PHONE_FORMAT_MISMATCH',
        description: 'Phone number with incorrect digit count',
      },
      {
        customer_id: 'CUST_002',
        email_address: 'invalid.email@',
        expected_type: 'EMAIL_INVALID_FORMAT',
        description: 'Email address with invalid format',
      },
      {
        customer_id: 'CUST_003',
        address: '東京都渋谷区道玄坂1-2-3',
        address_normalized: '東京都渋谷区道玄坂1丁目2番3号',
        expected_type: 'ADDRESS_NOTATION_VARIANCE',
        description: 'Address with notation variance',
      },
    ];

    inconsistency_dataset.forEach((dataset) => {
      detectDuplicateCustomersAndClassifyInconsistencies(
        {
          customer_id: dataset.customer_id,
          phone_number: dataset.phone_number || undefined,
          email_address: dataset.email_address || undefined,
          address: dataset.address || undefined,
        },
        mock_log_recorder
      );
    });

    expect(recorded_logs.length).toBe(3);

    expect(recorded_logs[0].inconsistency_type).toBe('PHONE_FORMAT_MISMATCH');
    expect(recorded_logs[0].customer_data.customer_id).toBe('CUST_001');
    expect(recorded_logs[0].customer_data.phone_number).toBe('09012345');

    expect(recorded_logs[1].inconsistency_type).toBe('EMAIL_INVALID_FORMAT');
    expect(recorded_logs[1].customer_data.customer_id).toBe('CUST_002');
    expect(recorded_logs[1].customer_data.email_address).toBe('invalid.email@');

    expect(recorded_logs[2].inconsistency_type).toBe('ADDRESS_NOTATION_VARIANCE');
    expect(recorded_logs[2].customer_data.customer_id).toBe('CUST_003');
    expect(recorded_logs[2].customer_data.address).toBe('東京都渋谷区道玄坂1-2-3');
  });
});