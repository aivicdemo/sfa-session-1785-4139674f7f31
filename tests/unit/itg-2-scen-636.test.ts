import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-636
  test('重複判定結果に統合推奨フラグが含まれる', () => {
    const customerA = {
      customerId: 'ID_001',
      customerName: 'テスト顧客A',
      email: 'customer-a@example.com',
      phone: '090-1234-5678',
    };

    const customerB = {
      customerId: 'ID_002',
      customerName: 'テスト顧客A',
      email: 'customer-a@example.com',
      phone: '090-1234-5678',
    };

    const result = detectDuplicateAndMergeJudgment(customerA, customerB);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('duplicateDetectionResult');
    expect(result.duplicateDetectionResult).toHaveProperty('matchScore');
    expect(result.duplicateDetectionResult.matchScore).toBe(85);
    expect(result.duplicateDetectionResult).toHaveProperty('isDuplicate');
    expect(result.duplicateDetectionResult.isDuplicate).toBe(true);
    expect(result.duplicateDetectionResult).toHaveProperty('shouldMerge');
    expect(result.duplicateDetectionResult.shouldMerge).toBe(true);
  });
});