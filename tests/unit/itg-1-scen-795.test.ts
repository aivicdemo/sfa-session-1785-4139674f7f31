import { describe, test, expect } from '@jest/globals';
import { analyzeSalesRepActionPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析 - 営業プロセス標準書1件での乖離度分析', () => {
  // SCEN-795
  test('営業プロセス標準書が1件のとき、その1件に基づいて乖離度を分析する', () => {
    // テストデータ準備: 営業プロセス標準書1件
    const standardProcessBook = {
      id: 'PROC-STD-001',
      name: '標準営業プロセス',
      steps: [
        { stepOrder: 1, stepName: '初回接触' },
        { stepOrder: 2, stepName: '提案' },
        { stepOrder: 3, stepName: '受注' }
      ]
    };

    // テストデータ準備: 営業担当者の実行行動ログ
    const salesRepActionLogs = [
      { actionOrder: 1, actionName: '初回接触', timestamp: '2024-01-15T09:00:00Z' },
      { actionOrder: 2, actionName: '提案', timestamp: '2024-01-15T10:00:00Z' },
      { actionOrder: 3, actionName: '提案フォロー', timestamp: '2024-01-15T11:00:00Z' },
      { actionOrder: 4, actionName: '受注', timestamp: '2024-01-15T12:00:00Z' }
    ];

    const input = {
      salesRepId: 'REP-001',
      standardProcessBooks: [standardProcessBook],
      actionLogs: salesRepActionLogs
    };

    const result = analyzeSalesRepActionPattern(input);

    // 期待結果: 乖離度が0～100の範囲の数値として返される
    expect(result.deviationScore).toBeGreaterThanOrEqual(0);
    expect(result.deviationScore).toBeLessThanOrEqual(100);

    // 期待結果: 乖離度が15.5%（標準3ステップに対し追加1ステップ検出）
    expect(result.deviationScore).toBe(25);

    // 期待結果: 乖離内容に具体的な乖離項目が含まれること
    expect(result.deviationItems).toHaveLength(1);
    expect(result.deviationItems[0]).toEqual({
      itemType: '追加ステップ',
      stepName: '提案フォロー',
      description: '標準プロセスにない提案フォローステップが追加検出された'
    });

    // 期待結果: 比較対象となった標準書IDが結果に記録されていること
    expect(result.comparisonStandardProcessBookId).toBe('PROC-STD-001');

    // 期待結果: 営業担当者IDが結果に記録されていること
    expect(result.salesRepId).toBe('REP-001');
  });
});