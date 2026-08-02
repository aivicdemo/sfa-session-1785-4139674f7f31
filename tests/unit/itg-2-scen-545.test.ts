import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-545
  test('正規化後も企業名が不一致のままで統合判定が不可となる', () => {
    const customerDataA = {
      customer_id: 'CUST001',
      company_name: '株式会社テックソリューション',
      normalized_company_name: 'テックソリューション',
      phone: '090-1234-5678',
      address: '東京都渋谷区'
    };

    const customerDataB = {
      customer_id: 'CUST002',
      company_name: '(株)テックソリューション',
      normalized_company_name: 'テック ソリューション',
      phone: '090-1234-5679',
      address: '東京都渋谷区'
    };

    const result = detectAndClassifyDuplicateCustomers([customerDataA, customerDataB]);

    expect(result.can_merge).toBe(false);
    expect(result.merge_decision).toBe('不可');
    expect(result.classification_reason).toMatch(/正規化後も企業名が不一致のため統合対象外/);
  });
});