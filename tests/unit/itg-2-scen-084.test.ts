import { detectInconsistency } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 不整合検出', () => {
  test('SCEN-084: フィールド値が矛盾しているデータを検出する', () => {
    const input_data = {
      customer_type: '法人',
      representative_name: '山田太郎',
    };

    const result = detectInconsistency(input_data);

    expect(result.inconsistency_flag).toBe(true);
    expect(result.error_code).toBe('INCONSISTENCY_001');
    expect(result.message).toBe('法人顧客には代表者名の入力は不要です');
  });
});