import { normalizeAndJudgeCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1179
  test('[normal] 顧客データの正規化・統合判定 - 正規化対象の電話番号にハイフンが含まれている場合、ハイフンが削除される', () => {
    const input_customer_data = {
      customer_id: 'CUST001',
      customer_name: 'テスト太郎',
      phone_number: '090-1234-5678',
      email: 'test@example.com',
      company_name: 'テスト株式会社',
      prefecture: '東京都',
      city: '渋谷区',
      address: '1-2-3',
    };

    const normalized_result = normalizeAndJudgeCustomerMerge(input_customer_data);

    expect(normalized_result.phone_number).toBe('09012345678');
  });
});