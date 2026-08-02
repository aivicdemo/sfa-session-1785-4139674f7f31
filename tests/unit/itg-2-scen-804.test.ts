import { detectDuplicateAndMergeJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-804
  test('重複度スコアが統合判定閾値ちょうど（80点）の場合、統合候補として判定される', () => {
    const customer1 = {
      customerId: 'CUST001',
      name: '山田太郎',
      email: 'yamada@example.com'
    };

    const customer2 = {
      customerId: 'CUST002',
      name: '山田太朗',
      email: 'yamada.taro@example.com'
    };

    const result = detectDuplicateAndMergeJudgment({
      customer1,
      customer2,
      duplicateScoreThreshold: 80
    });

    expect(result.isDuplicate).toBe(true);
    expect(result.duplicateScore).toBe(80);
    expect(result.integrationStatus).toBe('candidate_for_integration');
  });
});