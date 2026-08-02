import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 重複判定ロジック', () => {
  // SCEN-1048
  test('相似度が閾値の下限に達する場合に重複と判定される', () => {
    const similarity_threshold = 0.85;

    const customer_data_a = {
      customer_name: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phone: '090-1234-5678',
    };

    const customer_data_b = {
      customer_name: '山田太郎',
      address: '東京都渋谷区1-1-2',
      phone: '090-1234-5678',
    };

    const result = detectDuplicateCustomers(
      customer_data_a,
      customer_data_b,
      similarity_threshold
    );

    expect(result.is_duplicate).toBe(true);
    expect(result.similarity_score).toBe(0.85);
    expect(result.duplicate_reason).toBe('相似度: 0.85 - 閾値以上のため重複');
  });
});