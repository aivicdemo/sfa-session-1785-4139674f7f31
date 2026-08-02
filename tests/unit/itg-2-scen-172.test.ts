import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-172
  test('顧客データ重複検出時にデータ不整合ログに検出された不整合箇所が記録される', () => {
    const recordA = {
      customer_id: 'A001',
      email: 'test@example.com',
      phone_number: '09012345678',
    };

    const recordB = {
      customer_id: 'B001',
      email: 'test@example.com',
      phone_number: '09087654321',
    };

    const beforeTestTime = new Date('2024-01-15T11:00:00Z');
    const afterTestTime = new Date('2024-01-15T11:00:05Z');

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.mismatch_logs).toBeDefined();
    expect(result.mismatch_logs.length).toBeGreaterThan(0);

    const mismatchLog = result.mismatch_logs[0];

    expect(mismatchLog.detection_type).toBe('顧客ID異なり・メールアドレス一致');
    expect(mismatchLog.mismatch_field).toBe('電話番号');
    expect(mismatchLog.mismatch_value_a).toBe('09012345678');
    expect(mismatchLog.mismatch_value_b).toBe('09087654321');
    expect(mismatchLog.record_id_a).toBe('A001');
    expect(mismatchLog.record_id_b).toBe('B001');

    const detectedTimestamp = new Date(mismatchLog.detected_timestamp);
    expect(detectedTimestamp.getTime()).toBeGreaterThanOrEqual(beforeTestTime.getTime());
    expect(detectedTimestamp.getTime()).toBeLessThanOrEqual(afterTestTime.getTime());

    expect(mismatchLog.severity).toBe('高');
  });
});