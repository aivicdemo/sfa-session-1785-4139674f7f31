import { detectAndRecordDataInconsistencies } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-824
  test('不整合ログが1件検出される場合、品質検証結果に正確に記録される', async () => {
    const mockInconsistencyLog = {
      id: 'LOG-001',
      customer_id: 'C-12345',
      field_name: 'メールアドレス',
      detected_at: new Date('2024-01-15T10:30:00Z'),
      inconsistency_content: '登録済みメールと本人確認メールが不一致',
    };

    const result = await detectAndRecordDataInconsistencies({
      inconsistency_logs: [mockInconsistencyLog],
    });

    expect(result.inconsistency_count).toBe(1);
    expect(result.quality_check_records).toHaveLength(1);

    const recordedCheck = result.quality_check_records[0];
    expect(recordedCheck.customer_id).toBe('C-12345');
    expect(recordedCheck.target_field).toBe('メールアドレス');
    expect(recordedCheck.inconsistency_content).toBe(
      '登録済みメールと本人確認メールが不一致'
    );
    expect(recordedCheck.detected_at).toEqual(new Date('2024-01-15T10:30:00Z'));
    expect(recordedCheck.status).toBe('検出完了');
  });
});