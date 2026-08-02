import { mergeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1181
  test('should return error when attempting to merge customers marked as non-duplicate', async () => {
    const customerId1 = 'CUST-001';
    const customerId2 = 'CUST-002';

    const mockDuplicationCheckResponse = {
      customerId1: customerId1,
      customerId2: customerId2,
      isDuplicate: false,
      score: 0.15,
    };

    const mockMergeAttempt = {
      sourceCustomerId: customerId1,
      targetCustomerId: customerId2,
      duplicationCheckResult: mockDuplicationCheckResponse,
    };

    expect(() => mergeCustomerData(mockMergeAttempt)).toThrow(/重複判定/);
  });
});