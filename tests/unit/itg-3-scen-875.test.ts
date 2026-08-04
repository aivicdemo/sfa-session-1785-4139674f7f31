import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-875: 適用可能性評価結果に同値が並ぶとき信頼度スコア計算が正しく処理される', () => {
    // Arrange: 同値スコア（0.85）を持つ複数の成功パターンを準備
    const successPatterns = [
      {
        patternId: 'pattern_001',
        name: '大手製造業向け予防保全提案',
        applicabilityScore: 0.85,
        weight: 1.0,
      },
      {
        patternId: 'pattern_002',
        name: '大手製造業向け効率化提案',
        applicabilityScore: 0.85,
        weight: 1.0,
      },
      {
        patternId: 'pattern_003',
        name: '大手製造業向けコスト削減提案',
        applicabilityScore: 0.85,
        weight: 1.0,
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    // モック化: evaluatePatternRelevance() が同値スコア 0.85 を複数回返却
    mockAIEngine.evaluatePatternRelevance.mockImplementation(() => 0.85);

    // Act: 信頼度スコア算出関数を実行
    const result = calculateRecommendationTrustScore(
      successPatterns,
      mockAIEngine,
    );

    // Assert: 計算結果の検証
    // (1) 信頼度スコアが0.85 ± 許容誤差0.01の範囲内であること
    expect(result.trustScore).toBeGreaterThanOrEqual(0.84);
    expect(result.trustScore).toBeLessThanOrEqual(0.86);

    // (2) 加重平均値が計算されていること（同値スコア0.85の平均）
    expect(result.weightedAverage).toBeCloseTo(0.85, 2);

    // (3) 標準偏差が0.0に近い値（許容誤差0.001以内）であること
    expect(result.standardDeviation).toBeLessThanOrEqual(0.001);

    // (4) 同値パターン数が正確に記録されていること（3件）
    expect(result.equalValuePatternCount).toBe(3);

    // (5) ログに『同値スコア検出』と『複数同値パターンの等価集計完了』が記録されていること
    expect(result.processLog).toContain('同値スコア検出');
    expect(result.processLog).toContain('複数同値パターンの等価集計完了');

    // (6) 返却フィールド構造が期待値と一致していること
    expect(result).toHaveProperty('trustScore');
    expect(result).toHaveProperty('weightedAverage');
    expect(result).toHaveProperty('standardDeviation');
    expect(result).toHaveProperty('equalValuePatternCount');
    expect(result).toHaveProperty('processLog');
  });
});