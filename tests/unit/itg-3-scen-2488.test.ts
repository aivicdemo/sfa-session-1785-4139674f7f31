import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの参照機能', () => {
  // SCEN-2488
  test('AIRecommendationEngine呼び出し失敗時に内部推奨パターンマスタから成功パターンを検索', async () => {
    const search_condition = {
      industry: 'SaaS',
      estimated_amount: 8000000,
      current_stage: '提案前'
    };

    const start_time = Date.now();
    const result = await findSimilarPatterns(search_condition);
    const elapsed_ms = Date.now() - start_time;

    expect(result.pattern_count).toBe(1);
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0].pattern_id).toBe('PAT001');
    expect(result.patterns[0].pattern_name).toBe('提案資料を3営業日以内に送付');
    expect(result.patterns[0].success_rate).toBe(85.5);
    expect(result.patterns[0].applicable_industry).toBe('SaaS');
    expect(result.patterns[0].applicable_amount_range).toBe('500万～1000万円');
    expect(result.patterns[0].created_date).toBe('2026-01-15');
    expect(elapsed_ms).toBeLessThan(30000);
  });
});