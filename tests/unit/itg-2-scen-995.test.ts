import { recordPurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-995
  test('購買結果記録・営業データ統合機能 - 操作ログに1件記録される場合に監査証跡が正しく記録される', async () => {
    const authenticated_user_id = 'user_12345';
    const business_data_id = 'bd_67890';
    const operation_timestamp_fixed = new Date('2024-01-15T10:30:45Z');
    const operation_type = 'PURCHASE_RECORD_INSERT';
    const operation_status = 'SUCCESS';

    const audit_log_request_payload = {
      authenticated_user_id: authenticated_user_id,
      business_data_id: business_data_id,
      operation_timestamp: operation_timestamp_fixed.toISOString(),
    };

    const expected_audit_record = {
      operation_timestamp: operation_timestamp_fixed.toISOString(),
      operation_type: operation_type,
      authenticated_user_id: authenticated_user_id,
      resource_id: business_data_id,
      status: operation_status,
    };

    const result = await recordPurchaseResult(audit_log_request_payload);

    expect(result).toEqual(expected_audit_record);
    expect(result.operation_timestamp).toBe(operation_timestamp_fixed.toISOString());
    expect(result.operation_type).toBe(operation_type);
    expect(result.authenticated_user_id).toBe(authenticated_user_id);
    expect(result.resource_id).toBe(business_data_id);
    expect(result.status).toBe(operation_status);
  });
});