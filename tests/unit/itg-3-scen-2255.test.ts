import { detectAnomalousPattern } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 異常パターン検出", () => {
  // SCEN-2255
  test("提案内容が標準プロセスから大幅に逸脱しているとき異常パターンとして検出される", () => {
    // モック: AIRecommendationEngine のスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalApproachId: "PA-2025-001",
        recommendedSteps: [
          { stepNumber: 1, stepName: "顧客初期接触", estimatedDays: 1 },
          { stepNumber: 2, stepName: "提案実施", estimatedDays: 0 },
        ],
        totalDealPeriodDays: 1,
        industryStandard: "電機製造業",
        confidence: 0.72,
        rationale: "急速な契約を推奨",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 標準プロセス定義
    const standardProcessDefinition = {
      industryStandard: "電機製造業",
      standardStepCount: 5,
      standardSteps: [
        "初期ヒアリング",
        "提案準備",
        "提案実施",
        "顧客検討期間",
        "契約締結",
      ],
      standardDealPeriodDays: 90,
      processStepDeviationThreshold: 0.4,
      dealPeriodDeviationThreshold: 0.7,
    };

    // 検出ロジックの実行
    const result = detectAnomalousPattern(
      mockAIEngine.generateRecommendation(),
      standardProcessDefinition
    );

    // 検証1: 異常パターンとして検出されること
    expect(result.isAnomalousPattern).toBe(true);

    // 検証2: 異常度スコアが閾値を超えていること
    expect(result.deviationScore).toBeGreaterThanOrEqual(70);

    // 検証3: 逸脱箇所の詳細情報が構造化されていること
    expect(result.deviationDetails).toBeDefined();
    expect(result.deviationDetails.length).toBeGreaterThan(0);

    // 検証4: 逸脱箇所の詳細情報に必須フィールドが含まれていること
    expect(result.deviationDetails[0]).toHaveProperty("deviatingStepName");
    expect(result.deviationDetails[0]).toHaveProperty("standardValue");
    expect(result.deviationDetails[0]).toHaveProperty("actualValue");
    expect(result.deviationDetails[0]).toHaveProperty("deviationRatePercent");
    expect(result.deviationDetails[0]).toHaveProperty("deviationType");

    // 検証5: プロセスステップ数の逸脱が検出されること
    const stepCountDeviation = result.deviationDetails.find(
      (d) => d.deviationType === "stepCount"
    );
    expect(stepCountDeviation).toBeDefined();
    expect(stepCountDeviation.standardValue).toBe(5);
    expect(stepCountDeviation.actualValue).toBe(2);
    expect(stepCountDeviation.deviationRatePercent).toBe(60);

    // 検証6: 商談期間の逸脱が検出されること
    const dealPeriodDeviation = result.deviationDetails.find(
      (d) => d.deviationType === "dealPeriod"
    );
    expect(dealPeriodDeviation).toBeDefined();
    expect(dealPeriodDeviation.standardValue).toBe(90);
    expect(dealPeriodDeviation.actualValue).toBe(1);
    expect(dealPeriodDeviation.deviationRatePercent).toBeGreaterThanOrEqual(98);

    // 検証7: 外部AIエージェントへの追加呼び出しが行われていないこと
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});