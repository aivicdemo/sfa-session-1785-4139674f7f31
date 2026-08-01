import { determineIssuePriorityTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-536: [normal] 問題対応タイミングの判定機能 - 中期対応が必要な問題が検出された場合、対応時期として中期が指定される
  test('中期対応が必要な問題に対して対応時期が中期として判定される', () => {
    const baseDate = new Date('2024-06-15T10:00:00Z');
    const detectionDate = new Date('2024-06-15T10:00:00Z');
    
    // 中期対応が必要な問題データ: 検出から30～90日以内に対応が必要
    const issueData = {
      issueId: 'ISSUE-001',
      detectionDate,
      severity: 'medium',
      requiredResolutionDays: 60,
      description: '営業データ品質スコアが低下傾向',
      detectedBy: 'AI_AGENT_HEALTH_CHECK'
    };

    const result = determineIssuePriorityTiming(issueData, baseDate);

    // 期待値: 対応時期が中期（MEDIUM_TERM）と判定される
    expect(result.timingCategory).toBe('MEDIUM_TERM');
    
    // 対応予定期限が現在日から30日以上90日以内の範囲で計算される
    // baseDate = 2024-06-15、30日後 = 2024-07-15、90日後 = 2024-09-13
    const expectedDueDate = new Date('2024-08-14T10:00:00Z'); // 60日後
    expect(result.dueDatePlanned).toEqual(expectedDueDate);
    
    // 対応時期が正しく設定されていることを確認
    expect(result.timingText).toBe('中期対応');
    
    // 対応優先度が適切に判定されていることを確認
    expect(result.priorityScore).toBeGreaterThan(30);
    expect(result.priorityScore).toBeLessThan(70);
  });
});