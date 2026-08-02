import { classifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-562
  test('分類結果に統合判定「可能/不可」が明記されて記録される', () => {
    const customer1 = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト太郎',
      address: '東京都渋谷区1-1-1',
      registeredAt: '2024-01-01T10:00:00Z'
    };

    const customer2 = {
      customerId: 'CUST-002',
      customerName: '株式会社テスト太郎',
      address: '東京都渋谷区1-1-2',
      registeredAt: '2024-01-02T10:00:00Z'
    };

    const inputCustomers = [customer1, customer2];

    const classificationResult = classifyDuplicateCustomers(inputCustomers);

    expect(classificationResult).toBeDefined();
    expect(classificationResult.duplicateClassification).toBe('possible');
    expect(classificationResult.mergeJudgment).toMatch(/可能|不可/);
    expect(classificationResult.recordId).toBeDefined();
    expect(typeof classificationResult.recordId).toBe('string');
    expect(classificationResult.recordId.length).toBeGreaterThan(0);
    
    expect(classificationResult.mergeJudgment).toBe('可能');
    expect(classificationResult.persistedToDatabase).toBe(true);
    expect(classificationResult.customersInvolved).toHaveLength(2);
    expect(classificationResult.customersInvolved[0].customerId).toBe('CUST-001');
    expect(classificationResult.customersInvolved[1].customerId).toBe('CUST-002');
  });
});