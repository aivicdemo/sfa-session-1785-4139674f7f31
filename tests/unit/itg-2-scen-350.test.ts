import { detectDuplicateCandidateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-350
  test('メールアドレスが空文字列である場合、重複候補スコア計算で当該項目がスキップされる', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '山田太郎',
      email: '',
      address: '東京都渋谷区1-1-1',
      phone: '09012345678'
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '山田太郎',
      email: 'yamada@example.com',
      address: '東京都渋谷区1-1-1',
      phone: '09012345678'
    };

    const result = detectDuplicateCandidateScore(customer_a, customer_b);

    // メールアドレスがスキップされ、氏名・住所・電話番号（3項目）のみで計算
    // 3項目すべて一致: (100/3) * 3 = 100ポイント
    // ただし、メールアドレス項目が計算から除外されているため、
    // 実際の計算は (100/3) × 3 = 100 の値が算出されるが、
    // スキップメッセージが trace に含まれていることを確認
    expect(result.score).toBe(100);
    expect(result.trace).toContain('スキップ');
    expect(result.trace).toContain('空文字列');
  });
});