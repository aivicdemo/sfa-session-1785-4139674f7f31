import { calculateDuplicateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-157
  test('電話番号完全一致の名寄せ基準でスコア計算が正しく実行される', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      email: 'yamada@example.com',
      company_name: '株式会社山田',
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      email: 'yamada.taro@example.com',
      company_name: '山田株式会社',
    };

    const criteria = 'phone_number_exact_match';

    const score = calculateDuplicateScore(recordA, recordB, criteria);

    expect(score).toBe(100);
  });
});