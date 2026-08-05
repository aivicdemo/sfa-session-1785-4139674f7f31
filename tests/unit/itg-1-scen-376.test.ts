import { matchSuccessPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-376
  test('成功パターンマッチング・提案アプローチ判定機能 - 過去の成功商談パターンが複数件のとき、顧客条件に合致するすべてのパターンが抽出される', () => {
    const success_patterns = [
      {
        pattern_id: 'pattern_a',
        industry: '製造業',
        company_size: '大企業',
        budget_min: 10000000,
      },
      {
        pattern_id: 'pattern_b',
        industry: '卸売業',
        company_size: '中堅企業',
        budget_min: 5000000,
      },
      {
        pattern_id: 'pattern_c',
        industry: '製造業',
        company_size: '中堅企業',
        budget_min: 3000000,
      },
    ];

    const customer_condition = {
      industry: '製造業',
      company_size: '中堅企業',
      budget_amount: 6000000,
    };

    const result = matchSuccessPatterns(success_patterns, customer_condition);

    expect(result).toEqual(
      expect.objectContaining({
        matched_patterns: expect.arrayContaining([
          expect.objectContaining({
            pattern_id: 'pattern_a',
            match_items: ['industry', 'budget_range'],
          }),
          expect.objectContaining({
            pattern_id: 'pattern_c',
            match_items: ['industry', 'company_size', 'budget_range'],
          }),
        ]),
        total_matched: 2,
      })
    );

    expect(result.matched_patterns).toHaveLength(2);
    expect(result.matched_patterns.map((p) => p.pattern_id)).toEqual(
      expect.arrayContaining(['pattern_a', 'pattern_c'])
    );
    expect(result.matched_patterns.map((p) => p.pattern_id)).not.toContain(
      'pattern_b'
    );
  });
});