import { analyzeBehaviorPatternAndDetermineCoachingPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-260
  test('行動パターン分析と改善指導優先順位判定機能 - 営業担当者のデータが0件の場合、改善指導対象者と指導内容が空の結果として返される', () => {
    const salesRepresentativeData = [];

    const result = analyzeBehaviorPatternAndDetermineCoachingPriority(salesRepresentativeData);

    expect(result.coaching_targets).toEqual([]);
    expect(result.coaching_content).toBe('');
  });
});