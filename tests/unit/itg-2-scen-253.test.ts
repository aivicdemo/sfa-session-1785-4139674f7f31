import { detectDuplicateCustomer } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-253
  test('[normal] 顧客データ重複検出機能 - 顧客名が重複候補の一方だけに存在するとき、正規化ルール適用結果が異なる', () => {
    // 顧客A: 顧客名："田中太郎"、住所："東京都渋谷区"、電話："09012345678"
    const customerA = {
      customerId: 'CUST-001',
      customerName: '田中太郎',
      address: '東京都渋谷区',
      phoneNumber: '09012345678',
    };

    // 顧客B: 顧客名："田中"、住所："東京都渋谷区"、電話："09012345678"
    const customerB = {
      customerId: 'CUST-002',
      customerName: '田中',
      address: '東京都渋谷区',
      phoneNumber: '09012345678',
    };

    // 正規化ルール（スペース除去、全角・半角統一、敬称除去など）を適用した重複検出処理を実行
    const result = detectDuplicateCustomer({
      registeredCustomer: customerA,
      targetCustomer: customerB,
      normalizationRules: {
        removeSpaces: true,
        unifyFullHalfWidth: true,
        removeHonorific: true,
      },
    });

    // 期待結果: 顧客Aの正規化後顧客名は"田中太郎"、顧客Bの正規化後顧客名は"田中"として異なる状態で保持され、
    // 両者が同一顧客ではないと判定される（重複候補から除外される）
    expect(result.registeredCustomerNormalizedName).toBe('田中太郎');
    expect(result.targetCustomerNormalizedName).toBe('田中');
    expect(result.isDuplicate).toBe(false);
    expect(result.duplicateConfidence).toBe(0);
  });
});