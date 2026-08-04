import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2187: 複数の成功パターンが抽出されたとき、最も高いマッチスコアを持つパターンが選出される", async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: "pattern_a",
          match_score: 0.92,
          proposal_approach: "顧客課題の段階的解決",
          industry: "製造業",
          company_size: "中堅企業",
        },
        {
          pattern_id: "pattern_c",
          match_score: 0.85,
          proposal_approach: "段階的導入型提案",
          industry: "製造業",
          company_size: "中堅企業",
        },
        {
          pattern_id: "pattern_b",
          match_score: 0.78,
          proposal_approach: "一括導入型提案",
          industry: "製造業",
          company_size: "中堅企業",
        },
      ]),
      generateRecommendation: jest.fn(),
    };

    const deal_condition = {
      industry: "製造業",
      company_size: "中堅企業",
      challenge: "業務効率化",
    };

    const result = await generateRecommendation(
      deal_condition,
      mockAIRecommendationEngine
    );

    expect(result.recommended_patterns).toHaveLength(3);
    expect(result.recommended_patterns[0].match_score).toBe(0.92);
    expect(result.recommended_patterns[0].pattern_id).toBe("pattern_a");
    expect(result.recommended_patterns[0].proposal_approach).toBe(
      "顧客課題の段階的解決"
    );
    expect(result.recommended_patterns[0].priority).toBe(1);

    expect(result.recommended_patterns[1].match_score).toBe(0.85);
    expect(result.recommended_patterns[1].pattern_id).toBe("pattern_c");
    expect(result.recommended_patterns[1].priority).toBe(2);

    expect(result.recommended_patterns[2].match_score).toBe(0.78);
    expect(result.recommended_patterns[2].pattern_id).toBe("pattern_b");
    expect(result.recommended_patterns[2].priority).toBe(3);

    expect(result.recommended_patterns[0].match_score).toBeGreaterThan(
      result.recommended_patterns[1].match_score
    );
    expect(result.recommended_patterns[1].match_score).toBeGreaterThan(
      result.recommended_patterns[2].match_score
    );
  });
});