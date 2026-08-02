import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-802: メールアドレスが完全一致する重複候補の重複度スコアが加算される', () => {
    // テストデータ: 同一メールアドレスを持つ顧客レコード2件
    const customer1 = {
      customerId: 'CUST001',
      customerName: '株式会社A',
      email: 'test@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      createdAt: '2024-01-01T00:00:00Z',
    };

    const customer2 = {
      customerId: 'CUST002',
      customerName: '株式会社A支店',
      email: 'test@example.com',
      phone: '090-9999-9999',
      address: '東京都新宿区',
      createdAt: '2024-01-05T00:00:00Z',
    };

    // 初期スコア（ベースラインとなる0点）
    const initialScore = 0;
    const emailMatchAddition = 25;

    // 重複度スコア計算ロジックを呼び出し
    const result = detectDuplicateCustomers([customer1, customer2]);

    // メールアドレス完全一致による重複度スコア加算処理の確認
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);

    // 最初の重複候補ペアを検証
    const duplicateCandidate = result[0];
    expect(duplicateCandidate).toBeDefined();
    expect(duplicateCandidate.score).toBe(initialScore + emailMatchAddition);
  });
});