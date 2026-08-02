import { calculateDuplicateCandidateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-349
  test('メールアドレスが欠けている場合、重複候補スコア計算で当該項目がスキップされる', () => {
    const customerDataA = {
      firstName: '太郎',
      lastName: '田中',
      phone: '090-1234-5678',
      email: null
    };

    const customerDataB = {
      firstName: '太郎',
      lastName: '田中',
      phone: '090-1234-5678',
      email: 'tanaka@example.com'
    };

    const scoreWithNullEmail = calculateDuplicateCandidateScore(customerDataA, customerDataB);

    const customerDataC = {
      firstName: '太郎',
      lastName: '田中',
      phone: '090-1234-5678',
      email: null
    };

    const customerDataD = {
      firstName: '太郎',
      lastName: '田中',
      phone: '090-1234-5678',
      email: null
    };

    const scoreWithBothNull = calculateDuplicateCandidateScore(customerDataC, customerDataD);

    expect(scoreWithNullEmail).toBe(1.0);
    expect(scoreWithBothNull).toBe(1.0);
    expect(scoreWithNullEmail).toEqual(scoreWithBothNull);
  });
});