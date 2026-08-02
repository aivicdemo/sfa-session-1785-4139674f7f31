import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1166
  test('相互に異なる顧客コード・顧客名・メールアドレス・電話番号を持つ2件データに対して重複判定を実行した場合、重複候補として検出されない', () => {
    const customerA = {
      customer_code: '001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1111-1111',
    };

    const customerB = {
      customer_code: '002',
      customer_name: '佐藤花子',
      email: 'sato@example.com',
      phone: '090-2222-2222',
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toEqual({
      has_duplicates: false,
      duplicate_candidates: [],
    });
  });
});