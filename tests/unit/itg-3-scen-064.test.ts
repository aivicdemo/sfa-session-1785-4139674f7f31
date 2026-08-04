import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性評価機能', () => {
  // SCEN-064
  test('[normal] 評価対象パターンが複数件の場合にすべてのパターンがスコア化される', () => {
    const pattern_a = {
      id: 'pattern_a',
      customer_industry: '製造業',
      customer_size: '大企業',
      proposal_type: '業務改善',
    };
    const pattern_b = {
      id: 'pattern_b',
      customer_industry: 'IT',
      customer_size: '中堅企業',
      proposal_type: '実装支援',
    };
    const pattern_c = {
      id: 'pattern_c',
      customer_industry: '金融',
      customer_size: 'スタートアップ',
      proposal_type: 'コンサル',
    };

    const evaluation_engine_stub = {
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern: any) => {
          if (pattern.id === 'pattern_a') return 0.85;
          if (pattern.id === 'pattern_b') return 0.72;
          if (pattern.id === 'pattern_c') return 0.68;
          return 0;
        }),
    };

    const request = {
      patterns: [pattern_a, pattern_b, pattern_c],
      engine: evaluation_engine_stub,
    };

    const result = evaluatePatternRelevance(request);

    expect(evaluation_engine_stub.evaluatePatternRelevance).toHaveBeenCalledTimes(
      3
    );
    expect(result.evaluated_patterns).toHaveLength(3);
    expect(result.evaluated_patterns[0]).toEqual({
      id: 'pattern_a',
      score: 0.85,
    });
    expect(result.evaluated_patterns[1]).toEqual({
      id: 'pattern_b',
      score: 0.72,
    });
    expect(result.evaluated_patterns[2]).toEqual({
      id: 'pattern_c',
      score: 0.68,
    });
    expect(result.total_evaluated_count).toBe(3);
  });
});