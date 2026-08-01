import { analyzeSalesActivityPatterns } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-798
  test('営業活動ログが0件のとき、警告とともにデフォルト分析結果を返す', () => {
    const sales_rep_id = 'SR001';
    const activity_logs = [];

    const result = analyzeSalesActivityPatterns({
      sales_rep_id,
      activity_logs,
    });

    expect(result.warning_message).toBe('営業活動ログが0件のため行動パターンを特定できません');
    expect(result.is_pattern_identified).toBe(false);
    expect(result.activity_count).toBe(0);
    expect(result.primary_pattern).toBe('UNKNOWN');
    expect(result.secondary_patterns).toEqual([]);
    expect(result.confidence_score).toBe(0);
    expect(result.recommendation).toBe('営業活動データを蓄積してから分析してください');
  });
});