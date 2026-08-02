import { detectDuplicateAndEvaluateIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-105
  test('顧客名が一致しても電話番号が異なる場合、確度が低下する', () => {
    const record1 = {
      customer_id: 'CUST001',
      customer_name: '太郎商事',
      phone_number: '090-1111-1111',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内'
    };

    const record2 = {
      customer_id: 'CUST002',
      customer_name: '太郎商事',
      phone_number: '090-2222-2222',
      postal_code: '100-0001',
      address: '東京都千代田区丸の内'
    };

    const result = detectDuplicateAndEvaluateIntegration(record1, record2);

    expect(result.integration_score).toBeLessThanOrEqual(70);
    expect(result.judgment_reason).toMatch(/顧客名は一致するが電話番号が異なる/);
  });
});