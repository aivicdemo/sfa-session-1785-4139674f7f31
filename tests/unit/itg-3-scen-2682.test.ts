import { displayRecommendationRationale } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2682: 推奨内容の信頼度スコアが閾値ちょうど（70%）のとき、根拠表示対象として処理される", () => {
    const stub_AIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(
        () => "過去の類似案件から成功パターンを抽出しました。本提案は顧客の経営課題に合致しており、成約可能性が高いと判定されています。"
      ),
      evaluatePatternRelevance: jest.fn(() => 70.0),
    };

    const recommendationResult = {
      recommendationId: "rec_20240115_001",
      customerId: "cust_12345",
      proposalApproach: "段階的な導入アプローチ",
      confidenceScore: 70.0,
      similarPatterns: [
        {
          patternId: "pat_001",
          matchRate: 0.85,
          caseDescription: "同規模製造業への提案成功事例",
        },
      ],
      successFactors: ["顧客の経営課題を理解した提案", "導入スケジュールの現実性"],
      riskFactors: ["競合提案の可能性"],
    };

    const input = {
      recommendationResult,
      aiEngine: stub_AIRecommendationEngine,
      confidentceScoreThreshold: 70.0,
    };

    const result = displayRecommendationRationale(input);

    expect(result.shouldDisplayRationale).toBe(true);
    expect(result.confidenceScore).toBe(70.0);
    expect(result.rationale).toBe(
      "過去の類似案件から成功パターンを抽出しました。本提案は顧客の経営課題に合致しており、成約可能性が高いと判定されています。"
    );
    expect(result.similarCasesSummary).toHaveLength(1);
    expect(result.similarCasesSummary[0]).toEqual({
      patternId: "pat_001",
      matchRate: 0.85,
      caseDescription: "同規模製造業への提案成功事例",
    });
    expect(result.successFactors).toEqual([
      "顧客の経営課題を理解した提案",
      "導入スケジュールの現実性",
    ]);
    expect(result.riskFactors).toEqual(["競合提案の可能性"]);
    expect(stub_AIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationResult
    );
  });
});