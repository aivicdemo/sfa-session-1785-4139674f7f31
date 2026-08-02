import { evaluateDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-472
  test('重複判定の信頼度スコアが閾値未満である場合、重複と判定されない', () => {
    const customerA = {
      customerId: 'CUST-001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customerB = {
      customerId: 'CUST-002',
      name: '山田太郎',
      email: 'yamada.taro@example.com',
    };

    const confidenceScore = 0.45;
    const confidenceThreshold = 0.50;

    const result = evaluateDuplicateCustomers(
      customerA,
      customerB,
      confidenceScore,
      confidenceThreshold
    );

    expect(result.isDuplicate).toBe(false);
    expect(result.mergeStatus).toBe('未処理');
    expect(result.confidenceScore).toBe(0.45);
    expect(result.thresholdMet).toBe(false);
  });
});