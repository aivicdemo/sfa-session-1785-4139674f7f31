import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-561
  test('[normal] 顧客データ重複検出・分類機能 - 分類結果に信頼度スコアが数値で記録される', () => {
    const testDataSet1 = [
      {
        customer_id: 'C001',
        customer_name: '株式会社A',
        email: 'contact@company-a.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区'
      },
      {
        customer_id: 'C002',
        customer_name: '株式会社エー',
        email: 'contact@company-a.com',
        phone: '03-1234-5678',
        address: '東京都渋谷区'
      }
    ];

    const result1 = detectAndClassifyDuplicateCustomers(testDataSet1);

    expect(result1).toBeDefined();
    expect(result1.classification).toBeDefined();
    expect(result1.classification.confidence_score).toBeDefined();
    expect(typeof result1.classification.confidence_score).toBe('number');
    expect(result1.classification.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result1.classification.confidence_score).toBeLessThanOrEqual(1);

    const testDataSet2 = [
      {
        customer_id: 'C003',
        customer_name: 'ABC Corporation',
        email: 'info@abc-corp.jp',
        phone: '090-9999-8888',
        address: '大阪府北区'
      },
      {
        customer_id: 'C004',
        customer_name: 'ABC Corp',
        email: 'info@abc-corp.jp',
        phone: '090-9999-8888',
        address: '大阪府北区'
      },
      {
        customer_id: 'C005',
        customer_name: 'ABC Corporation Ltd.',
        email: 'info@abc-corp.jp',
        phone: '090-9999-8888',
        address: '大阪府北区'
      }
    ];

    const result2 = detectAndClassifyDuplicateCustomers(testDataSet2);

    expect(result2).toBeDefined();
    expect(result2.classification).toBeDefined();
    expect(result2.classification.confidence_score).toBeDefined();
    expect(typeof result2.classification.confidence_score).toBe('number');
    expect(result2.classification.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result2.classification.confidence_score).toBeLessThanOrEqual(1);

    const testDataSet3 = [
      {
        customer_id: 'C006',
        customer_name: '有限会社X',
        email: 'sales@x-limited.com',
        phone: '052-555-1234',
        address: '名古屋市中区'
      },
      {
        customer_id: 'C007',
        customer_name: '有限会社X',
        email: 'sales@x-limited.com',
        phone: '052-555-1234',
        address: '名古屋市中区'
      }
    ];

    const result3 = detectAndClassifyDuplicateCustomers(testDataSet3);

    expect(result3).toBeDefined();
    expect(result3.classification).toBeDefined();
    expect(result3.classification.confidence_score).toBeDefined();
    expect(typeof result3.classification.confidence_score).toBe('number');
    expect(result3.classification.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result3.classification.confidence_score).toBeLessThanOrEqual(1);
  });
});