import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: パターンマッチングと照合の実行', () => {
  // SCEN-1073
  test('複数の成功パターンと照合された場合、すべてのスコアが計算され返却される', () => {
    // 入力: テスト対象の商談条件データ
    const dealConditions = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakers: 3,
    };

    // モック成功パターンのセット
    const successPatterns = [
      {
        patternId: 'PAT-001',
        industry: '製造業',
        amountRange: { min: 3000000, max: 8000000 },
        decisionMakerRange: { min: 2, max: 5 },
        winRate: 0.85,
        amountMatchDegree: 0.95,
        industryMatchDegree: 1.0,
      },
      {
        patternId: 'PAT-002',
        industry: '製造業',
        amountRange: { min: 1000000, max: 10000000 },
        decisionMakerRange: { min: 1, max: 4 },
        winRate: 0.72,
        amountMatchDegree: 0.88,
        industryMatchDegree: 1.0,
      },
      {
        patternId: 'PAT-003',
        industry: '製造業',
        amountRange: { min: 2000000, max: 6000000 },
        decisionMakerRange: { min: 2, max: 3 },
        winRate: 0.92,
        amountMatchDegree: 0.99,
        industryMatchDegree: 1.0,
      },
    ];

    // 期待される計算値
    // 各パターンのスコア = (提案成功率 × 0.4 + 案件規模マッチ度 × 0.35 + 顧客業種適合度 × 0.25)
    // PAT-001: (0.85 × 0.4 + 0.95 × 0.35 + 1.0 × 0.25) = 0.34 + 0.3325 + 0.25 = 0.9225 → 0.92
    // PAT-002: (0.72 × 0.4 + 0.88 × 0.35 + 1.0 × 0.25) = 0.288 + 0.308 + 0.25 = 0.846 → 0.85（小数第2位で四捨五入）
    // PAT-003: (0.92 × 0.4 + 0.99 × 0.35 + 1.0 × 0.25) = 0.368 + 0.3465 + 0.25 = 0.9645 → 0.96

    const expectedRelevanceScores = [
      {
        patternId: 'PAT-003',
        relevanceScore: 0.96,
        winRate: 0.92,
        amountMatchDegree: 0.99,
        industryMatchDegree: 1.0,
      },
      {
        patternId: 'PAT-001',
        relevanceScore: 0.92,
        winRate: 0.85,
        amountMatchDegree: 0.95,
        industryMatchDegree: 1.0,
      },
      {
        patternId: 'PAT-002',
        relevanceScore: 0.85,
        winRate: 0.72,
        amountMatchDegree: 0.88,
        industryMatchDegree: 1.0,
      },
    ];

    // 実際の実行: 各パターンの関連度スコアを計算
    const results = successPatterns.map((pattern) => {
      const relevanceScore = evaluatePatternRelevance({
        pattern,
        dealConditions,
      });
      return {
        patternId: pattern.patternId,
        relevanceScore,
        winRate: pattern.winRate,
        amountMatchDegree: pattern.amountMatchDegree,
        industryMatchDegree: pattern.industryMatchDegree,
      };
    });

    // スコアが高い順にソート
    const sortedResults = results.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    // 検証
    expect(sortedResults).toHaveLength(3);

    // 各パターンが返却されていること
    expect(sortedResults[0].patternId).toBe('PAT-003');
    expect(sortedResults[1].patternId).toBe('PAT-001');
    expect(sortedResults[2].patternId).toBe('PAT-002');

    // スコアが計算され返却されていること（小数第2位まで）
    expect(sortedResults[0].relevanceScore).toBe(0.96);
    expect(sortedResults[1].relevanceScore).toBe(0.92);
    expect(sortedResults[2].relevanceScore).toBe(0.85);

    // スコアが0.0～1.0の範囲内に正規化されていること
    sortedResults.forEach((result) => {
      expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    });

    // スコア根拠が返却されていること
    sortedResults.forEach((result) => {
      expect(result.winRate).toBeDefined();
      expect(result.amountMatchDegree).toBeDefined();
      expect(result.industryMatchDegree).toBeDefined();
    });

    // スコアが高い順にソートされていること
    for (let i = 0; i < sortedResults.length - 1; i++) {
      expect(sortedResults[i].relevanceScore).toBeGreaterThanOrEqual(
        sortedResults[i + 1].relevanceScore
      );
    }
  });
});