import { determineCustomerMergeEligibility } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-115
  test('重複確度が81%の場合、統合対象と判定される', () => {
    const duplicateConfidence = 81;
    const result = determineCustomerMergeEligibility({
      duplicateConfidence,
    });

    expect(result.shouldMerge).toBe(true);
    expect(result.confidenceLevel).toBe(81);
    expect(result.reason).toMatch(/重複確度81%/);
    expect(result.reason).toMatch(/閾値80%以上/);
    expect(result.reason).toMatch(/統合対象/);
  });
});