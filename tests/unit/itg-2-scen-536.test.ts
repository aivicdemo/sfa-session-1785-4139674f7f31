import { detectDuplicateCustomersWithPatternMatching } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-536
  test('重複原因パターン定義が複数件のとき、優先度順に照合して最初にマッチしたパターンに分類する', () => {
    const duplicatePatterns = [
      {
        patternId: 'PATTERN_A',
        priority: 1,
        name: 'パターンA',
        description: '名前完全一致かつ電話番号一致',
        rules: [
          { field: 'customer_name', matchType: 'exact' },
          { field: 'phone_number', matchType: 'exact' }
        ]
      },
      {
        patternId: 'PATTERN_B',
        priority: 2,
        name: 'パターンB',
        description: '名前完全一致かつ住所一致',
        rules: [
          { field: 'customer_name', matchType: 'exact' },
          { field: 'address', matchType: 'exact' }
        ]
      },
      {
        patternId: 'PATTERN_C',
        priority: 3,
        name: 'パターンC',
        description: 'メールアドレス一致',
        rules: [
          { field: 'email', matchType: 'exact' }
        ]
      }
    ];

    const customerX = {
      customerId: 'CUST_X',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      address: '東京都渋谷区',
      email: 'yamada@example.com'
    };

    const customerY = {
      customerId: 'CUST_Y',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      address: '大阪府大阪市',
      email: 'yamada.taro@example.com'
    };

    const result = detectDuplicateCustomersWithPatternMatching(
      customerX,
      customerY,
      duplicatePatterns
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.matchedPatternId).toBe('PATTERN_A');
    expect(result.matchedPatternName).toBe('パターンA');
    expect(result.matchReason).toBe('名前完全一致かつ電話番号一致');
    expect(result.matchedPriority).toBe(1);
    expect(result.patternsEvaluated).toBe(1);
  });
});