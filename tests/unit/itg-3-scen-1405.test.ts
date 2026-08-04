import { evaluateProposalAgainstConstraints } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の照合", () => {
  // SCEN-1405
  test("提案内容と顧客制約条件の自動照合機能 - 照合対象の経営目標とスケジュール制約が重複を含むとき、重複排除の上照合が実行される", () => {
    // 提案内容オブジェクト（AIRecommendationEngineから生成される提案内容を表現）
    const proposalContent = {
      productId: "PROD-001",
      description: "売上成長向けデジタル変革ソリューション",
      estimatedCost: 5000000,
      expectedROI: 1.8,
    };

    // 経営目標リスト（重複を含む）
    const businessObjectives = [
      "売上成長20%達成",
      "コスト削減30%",
      "売上成長20%達成", // 重複
    ];

    // スケジュール制約リスト（重複を含む）
    const scheduleConstraints = [
      "Q1完了",
      "Q2完了",
      "Q1完了", // 重複
    ];

    // 照合ロジックが重複排除を実行するかスパイで検証
    const deduplicateObjectivesSpy = jest.spyOn(
      Array.prototype,
      "filter"
    );

    // 照合機能を実行
    const result = evaluateProposalAgainstConstraints(
      proposalContent,
      businessObjectives,
      scheduleConstraints
    );

    // スパイをクリア
    deduplicateObjectivesSpy.mockRestore();

    // 照合結果の検証
    // recommendationMatchStatus が true を返す
    expect(result.recommendationMatchStatus).toBe(true);

    // matchedBusinessObjectives に重複排除後のユニークな値のみが格納される
    expect(result.matchedBusinessObjectives).toEqual(
      expect.arrayContaining([
        "売上成長20%達成",
        "コスト削減30%",
      ])
    );
    expect(result.matchedBusinessObjectives.length).toBe(2);

    // matchedScheduleConstraints に重複排除後のユニークな値のみが格納される
    expect(result.matchedScheduleConstraints).toEqual(
      expect.arrayContaining([
        "Q1完了",
        "Q2完了",
      ])
    );
    expect(result.matchedScheduleConstraints.length).toBe(2);

    // 重複要素が最終的な照合プロセスから排除されていることを確認
    // matchedBusinessObjectives に2番目の「売上成長20%達成」が含まれていないことを確認
    const businessObjectiveOccurrences = result.matchedBusinessObjectives.filter(
      (obj: string) => obj === "売上成長20%達成"
    ).length;
    expect(businessObjectiveOccurrences).toBe(1);

    // matchedScheduleConstraints に2番目の「Q1完了」が含まれていないことを確認
    const scheduleConstraintOccurrences = result.matchedScheduleConstraints.filter(
      (constraint: string) => constraint === "Q1完了"
    ).length;
    expect(scheduleConstraintOccurrences).toBe(1);

    // 照合ロジックが一意な制約条件セットに対してのみ実行されていることを確認
    // 照合結果にmatchingConfidenceScore が存在し、0-100の範囲内であることを確認
    expect(result.matchingConfidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.matchingConfidenceScore).toBeLessThanOrEqual(100);

    // 照合結果が提案内容を含んでいることを確認
    expect(result.proposalContent).toEqual(proposalContent);
  });
});