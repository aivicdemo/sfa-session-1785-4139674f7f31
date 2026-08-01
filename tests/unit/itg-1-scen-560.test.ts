import { describe, test, expect } from '@jest/globals';
import { groupProblemsByResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-560: 対応時期別のグループに問題が1件の場合、正しくグループ分けされる', () => {
    // テストデータ: 緊急（本日対応）の問題1件
    const testProblems = [
      {
        id: 'problem-001',
        title: '営業提案の不適切な内容検出',
        status: 'detected',
        severity: 'high',
        responseTimingCategory: 'urgent_today',
        detectedAt: '2024-01-15T10:30:00Z',
        affectedSalesPersonId: 'sales-001'
      }
    ];

    // グループ化処理を実行
    const result = groupProblemsByResponseTiming(testProblems);

    // 結果の構造を検証
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // グループ数の検証: 緊急グループのみが生成される
    expect(result.length).toBe(1);

    // 緊急グループの検証
    const urgentGroup = result[0];
    expect(urgentGroup).toBeDefined();
    expect(urgentGroup.timingCategory).toBe('urgent_today');
    expect(urgentGroup.timingLabel).toBe('緊急（本日対応）');

    // グループ内の問題数を検証
    expect(Array.isArray(urgentGroup.problems)).toBe(true);
    expect(urgentGroup.problems.length).toBe(1);

    // グループ内の問題の内容を検証
    const problemInGroup = urgentGroup.problems[0];
    expect(problemInGroup.id).toBe('problem-001');
    expect(problemInGroup.title).toBe('営業提案の不適切な内容検出');
    expect(problemInGroup.status).toBe('detected');
    expect(problemInGroup.severity).toBe('high');
    expect(problemInGroup.responseTimingCategory).toBe('urgent_today');

    // 他の対応時期グループが存在しないことを検証
    const hasThisWeekGroup = result.some(group => group.timingCategory === 'this_week');
    const hasNextWeekGroup = result.some(group => group.timingCategory === 'next_week_or_later');
    expect(hasThisWeekGroup).toBe(false);
    expect(hasNextWeekGroup).toBe(false);
  });
});