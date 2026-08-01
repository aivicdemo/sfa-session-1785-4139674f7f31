import { calculateDeviationScoreForSalesExecutive } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-814
  test('重複したステップを排除してから標準プロセスとの乖離度を計算する', () => {
    // 営業活動ログデータ: ステップA→ステップA→ステップB→ステップA→ステップB
    // 重複排除後: ステップA→ステップB→ステップA→ステップB
    const activityLogs = [
      { stepName: 'ステップA', timestamp: '2024-01-15T09:00:00Z' },
      { stepName: 'ステップA', timestamp: '2024-01-15T09:30:00Z' },
      { stepName: 'ステップB', timestamp: '2024-01-15T10:00:00Z' },
      { stepName: 'ステップA', timestamp: '2024-01-15T10:30:00Z' },
      { stepName: 'ステップB', timestamp: '2024-01-15T11:00:00Z' },
    ];

    // 標準営業プロセス
    const standardProcess = ['ステップA', 'ステップB', 'ステップC'];

    // 営業担当者行動パターン分析機能を実行
    const result = calculateDeviationScoreForSalesExecutive({
      activityLogs,
      standardProcess,
    });

    // 重複排除後のステップシーケンス: ステップA→ステップB→ステップA→ステップB
    // 標準プロセス: ステップA→ステップB→ステップC
    // 乖離度計算: 重複排除後のシーケンスと標準プロセスの差分
    // 期待値: 50% (またはそれと同等の定量的な値)
    expect(result.deviationScore).toBe(50);
    expect(result.deduplicatedSequence).toEqual(['ステップA', 'ステップB', 'ステップA', 'ステップB']);
    expect(result.standardProcess).toEqual(['ステップA', 'ステップB', 'ステップC']);
  });
});