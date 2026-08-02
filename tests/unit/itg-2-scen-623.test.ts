import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-623
  test('類似度スコアが閾値直下79.9%の場合、重複判定されない', () => {
    const customerA = {
      customerId: 'CUST-001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerB = {
      customerId: 'CUST-002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5679',
    };

    const result = detectDuplicateCustomers(
      [customerA, customerB],
      { similarityThreshold: 80.0, mockSimilarityScore: 79.9 }
    );

    expect(result.isDuplicate).toBe(false);
    expect(result.mergeCandidate).toBe(false);
    expect(result.similarityScore).toBe(79.9);
  });
});