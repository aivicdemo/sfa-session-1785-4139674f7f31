import { determineCustomerMergeEligibility } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  test('SCEN-399: 統合判定確度94%の顧客ペアが除外判定される', () => {
    const customerPair = {
      customerId1: 'CUST-001',
      customerId2: 'CUST-002',
      confidenceScore: 94,
      duplicateDetectionReason: 'name_match',
      lastUpdated: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const result = determineCustomerMergeEligibility(customerPair);

    expect(result.shouldExclude).toBe(true);
    expect(result.mergeEligible).toBe(false);
    expect(result.confidenceScore).toBe(94);
    expect(result.exclusionReason).toMatch(/確度94%/);
    expect(result.exclusionReason).toMatch(/除外基準を満たさないため対象外/);
    expect(result.processingLog).toContain('確度94% - 除外基準を満たさないため対象外');
  });
});