import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-559
  test('分類結果に正規化適用前のデータが履歴として記録される', () => {
    const input_customer_data = {
      customer_id: 'CUST001',
      customer_name: ' 山田　太郎 ',
      phone_number: '03-1234-5678',
      email: 'yamada.taro@example.com',
      company_name: 'サンプル企業',
    };

    const classification_result = detectAndClassifyDuplicateCustomers([input_customer_data]);

    expect(classification_result).toBeDefined();
    expect(classification_result.history).toBeDefined();
    expect(Array.isArray(classification_result.history)).toBe(true);
    expect(classification_result.history.length).toBeGreaterThan(0);

    const history_record = classification_result.history[0];
    expect(history_record.original_data).toBeDefined();
    expect(history_record.original_data.customer_name).toBe(' 山田　太郎 ');
    expect(history_record.original_data.phone_number).toBe('03-1234-5678');
    expect(history_record.timestamp).toBeDefined();
    expect(typeof history_record.timestamp).toBe('string');
    expect(history_record.status).toBe('classified');
  });
});