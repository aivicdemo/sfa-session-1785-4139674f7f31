import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-160: 同じレコードペアを複数回検査したとき、毎回同じ判定結果が返される', () => {
    const customerPair = {
      customerId1: 'A001',
      customerId2: 'A002',
      name1: '株式会社テスト',
      name2: '株式会社テスト',
      address1: '東京都渋谷区1-1-1',
      address2: '東京都渋谷区1-1-1',
    };

    const result1 = detectDuplicateCustomersAndJudgeIntegration(customerPair);
    const result2 = detectDuplicateCustomersAndJudgeIntegration(customerPair);
    const result3 = detectDuplicateCustomersAndJudgeIntegration(customerPair);

    expect(result1.integrationJudgment).toBe('統合推奨');
    expect(result1.matchScore).toBe(95);
    expect(result1.reason).toBe('顧客名および住所が完全一致');

    expect(result2.integrationJudgment).toBe(result1.integrationJudgment);
    expect(result2.matchScore).toBe(result1.matchScore);
    expect(result2.reason).toBe(result1.reason);

    expect(result3.integrationJudgment).toBe(result1.integrationJudgment);
    expect(result3.matchScore).toBe(result1.matchScore);
    expect(result3.reason).toBe(result1.reason);

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});