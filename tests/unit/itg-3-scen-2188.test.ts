import { findSimilarPatterns } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-2188: 複数の成功パターンが同一マッチスコアを持つとき、全て同じ優先順位で返される", async () => {
    // テストデータ: マッチスコア0.92で同値の3つの成功パターン
    const patternA = {
      patternId: "pattern_001",
      customerSegment: "mid_size_manufacturing",
      industry: "manufacturing",
      budgetRange: "5000000",
      successRate: 0.88,
      matchScore: 0.92,
      priority: 1,
    };

    const patternB = {
      patternId: "pattern_002",
      customerSegment: "mid_size_manufacturing",
      industry: "manufacturing",
      budgetRange: "5000000",
      successRate: 0.85,
      matchScore: 0.92,
      priority: 1,
    };

    const patternC = {
      patternId: "pattern_003",
      customerSegment: "mid_size_manufacturing",
      industry: "manufacturing",
      budgetRange: "5000000",
      successRate: 0.83,
      matchScore: 0.92,
      priority: 1,
    };

    // AIRecommendationEngineのスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([patternA, patternB, patternC]),
    };

    // 新規案件の商談条件入力データ
    const dealCondition = {
      customerSize: "mid_size",
      industry: "manufacturing",
      budgetRange: "5000000",
      dealStage: "proposal_phase",
    };

    // 複数パターン選出ロジックの実行
    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    // 返却結果の検証
    expect(result).toHaveLength(3);
    expect(result[0].matchScore).toBe(0.92);
    expect(result[1].matchScore).toBe(0.92);
    expect(result[2].matchScore).toBe(0.92);
    expect(result[0].priority).toBe(1);
    expect(result[1].priority).toBe(1);
    expect(result[2].priority).toBe(1);
    expect(result.every((pattern) => pattern.priority === result[0].priority)).toBe(
      true
    );
  });
});