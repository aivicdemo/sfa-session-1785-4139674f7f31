import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-535: 重複原因パターン定義が1件のとき、該当データをそのパターンに分類する', () => {
    // Setup: 重複原因パターン定義
    const duplicatePatternDefinitions = [
      {
        patternId: 'P001',
        patternName: '名義人名義違い',
        rule: '姓名の表記揺れ',
      },
    ];

    // Setup: 顧客データペア
    const customerDataPairs = [
      {
        customerId_A: 'CUST001',
        customerName_A: '山田太郎',
        customerId_B: 'CUST002',
        customerName_B: '山田 太郎',
      },
    ];

    // Execute
    const result = detectAndClassifyDuplicateCustomers(
      duplicatePatternDefinitions,
      customerDataPairs
    );

    // Assert: 分類結果の構造と値を検証
    expect(result.classificationResults).toEqual([
      {
        pairIndex: 0,
        customerId_A: 'CUST001',
        customerId_B: 'CUST002',
        assignedPatternId: 'P001',
        assignedPatternName: '名義人名義違い',
        classificationStatus: 'success',
      },
    ]);

    // Assert: 分類統計
    expect(result.classificationStatistics).toEqual({
      totalTargetCount: 1,
      successCount: 1,
      failureCount: 0,
    });
  });
});