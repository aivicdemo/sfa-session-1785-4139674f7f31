import { analyzeAndJudgeImprovementTargets } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-192: 改善指導優先度が最高位の場合、即座に実施対象として管理職に提示される", () => {
    // Arrange: 改善指導優先度『最高位』の営業担当者の行動パターン分析結果を入力
    const analysisInput = {
      salesRepId: "SR-001",
      salesRepName: "営業太郎",
      deviationScore: 35,
      improvementPriorityLevel: "最高位",
      improvementContent: "顧客初期接触後の提案タイミング遅延",
      recommendedActionDescription: "初回接触から3営業日以内に提案を実施すること",
      analysisDate: "2024-01-15T11:00:00Z",
      dataQualityScore: 92,
    };

    // Act: 改善指導対象判定機能を実行
    const result = analyzeAndJudgeImprovementTargets(analysisInput);

    // Assert: 改善指導優先度『最高位』の対象者が『即座に実施対象』として表示される
    expect(result.immediateExecutionTargetFlag).toBe(true);
    expect(result.salesRepId).toBe("SR-001");
    expect(result.salesRepName).toBe("営業太郎");
    expect(result.improvementContent).toBe(
      "顧客初期接触後の提案タイミング遅延"
    );
    expect(result.priorityLevel).toBe("最高位");
    expect(result.dashboardSectionName).toBe("即座に実施対象");
    expect(result.priorityRank).toBe(1);
  });
});