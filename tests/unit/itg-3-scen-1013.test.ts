import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出機能 - 過去商談データが複数件の場合、類似度でランク付けされた複数パターンが抽出される", () => {
  test("SCEN-1013", () => {
    // 新規案件の顧客属性
    const newDealCondition = {
      industry: "製造業",
      scale: "中堅企業",
      challenge: "コスト削減",
    };

    // AIRecommendationEngine のスタブ
    const stubAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "PATTERN_A",
          similarityScore: 0.95,
          proposalMethod: "段階的導入",
          historicalClosureRate: 0.85,
        },
        {
          patternId: "PATTERN_B",
          similarityScore: 0.87,
          proposalMethod: "ROI重視提案",
          historicalClosureRate: 0.78,
        },
        {
          patternId: "PATTERN_C",
          similarityScore: 0.76,
          proposalMethod: "複数部門横展開",
          historicalClosureRate: 0.72,
        },
        {
          patternId: "PATTERN_D",
          similarityScore: 0.62,
          proposalMethod: "段階的導入",
          historicalClosureRate: 0.65,
        },
        {
          patternId: "PATTERN_E",
          similarityScore: 0.48,
          proposalMethod: "既存顧客事例紹介",
          historicalClosureRate: 0.58,
        },
      ]),
    };

    // 成功パターン抽出機能を実行
    const result = findSimilarPatterns(newDealCondition, stubAIEngine);

    // 返却されたパターンが Promise であることを確認して解決
    return result.then((patterns) => {
      // 抽出されたパターンが3件以上であることを確認
      expect(patterns.length).toBeGreaterThanOrEqual(3);

      // 最初のパターン（スコア 0.95）の検証
      expect(patterns[0]).toEqual({
        patternId: "PATTERN_A",
        similarityScore: 0.95,
        proposalMethod: "段階的導入",
        historicalClosureRate: 0.85,
      });

      // 2番目のパターン（スコア 0.87）の検証
      expect(patterns[1]).toEqual({
        patternId: "PATTERN_B",
        similarityScore: 0.87,
        proposalMethod: "ROI重視提案",
        historicalClosureRate: 0.78,
      });

      // 3番目のパターン（スコア 0.76）の検証
      expect(patterns[2]).toEqual({
        patternId: "PATTERN_C",
        similarityScore: 0.76,
        proposalMethod: "複数部門横展開",
        historicalClosureRate: 0.72,
      });

      // 類似度スコアが降順であることを確認
      for (let i = 0; i < patterns.length - 1; i++) {
        expect(patterns[i].similarityScore).toBeGreaterThanOrEqual(
          patterns[i + 1].similarityScore
        );
      }
    });
  });
});