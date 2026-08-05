import { rankSuccessPatternsByConversionRate } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-413
  test('成功パターン適用判定機能 - 適用可能なパターンが複数存在する場合、成約率の高い順に並べられる', () => {
    const pattern_a = {
      id: 'pattern_a',
      name: 'パターンA',
      conversion_rate: 75,
      customer_segment: 'segment_1',
      product_category: 'category_1',
      proposal_approach: 'approach_1',
    };

    const pattern_b = {
      id: 'pattern_b',
      name: 'パターンB',
      conversion_rate: 90,
      customer_segment: 'segment_1',
      product_category: 'category_1',
      proposal_approach: 'approach_1',
    };

    const pattern_c = {
      id: 'pattern_c',
      name: 'パターンC',
      conversion_rate: 82,
      customer_segment: 'segment_1',
      product_category: 'category_1',
      proposal_approach: 'approach_1',
    };

    const applicable_patterns = [pattern_a, pattern_b, pattern_c];

    const result = rankSuccessPatternsByConversionRate(applicable_patterns);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('pattern_b');
    expect(result[0].conversion_rate).toBe(90);
    expect(result[1].id).toBe('pattern_c');
    expect(result[1].conversion_rate).toBe(82);
    expect(result[2].id).toBe('pattern_a');
    expect(result[2].conversion_rate).toBe(75);
  });
});