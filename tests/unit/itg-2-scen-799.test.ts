import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-799
  test('顧客名の部分一致が検出され、重複度スコアが中程度として計算される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1111-1111',
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: '山田太郎様',
      address: '東京都渋谷区',
      phone: '090-1111-1111',
    };

    const detection_result = detectDuplicateCustomers(customer_a, customer_b);

    expect(detection_result.is_duplicate_detected).toBe(true);
    expect(detection_result.duplicate_score).toBeGreaterThanOrEqual(0.5);
    expect(detection_result.duplicate_score).toBeLessThan(0.8);
    expect(detection_result.match_reasons).toContain('顧客名部分一致');
    expect(detection_result.match_reasons).toContain('住所完全一致');
    expect(detection_result.match_reasons).toContain('電話完全一致');
  });
});