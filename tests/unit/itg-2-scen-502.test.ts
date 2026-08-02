import { detectDuplicateCustomersAndJudgeMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-502
  test('重複スコアが許容閾値未満のとき、統合対象外として判定される', () => {
    const thresholdValue = 0.75;
    const duplicateScore = 0.70;

    const inputCustomerA = {
      customerId: 'CUST001',
      customerName: 'テスト顧客A',
      email: 'test-a@example.com',
      phone: '090-1234-5678',
    };

    const inputCustomerB = {
      customerId: 'CUST002',
      customerName: 'テスト顧客B',
      email: 'test-b@example.com',
      phone: '090-1234-5678',
    };

    const result = detectDuplicateCustomersAndJudgeMerge({
      customerA: inputCustomerA,
      customerB: inputCustomerB,
      duplicateScore: duplicateScore,
      threshold: thresholdValue,
    });

    expect(result.isMergeCandidate).toBe(false);
    expect(result.reasonCode).toBe('BELOW_THRESHOLD');
  });
});