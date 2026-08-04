import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨根拠の可視化機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2561
  test("推奨根拠の可視化機能 - 同じ推奨根拠で2回実行したとき、同じ可視化結果が生成される", async () => {
    const dealCondition = {
      customer_industry: "IT",
      budget_amount: 5000000,
      challenge_pattern: "システム統合",
      deal_id: "DEAL-2024-001",
      customer_id: "CUST-2024-555",
    };

    const mockRecommendationRationale = {
      rationale_id: "RATIONALE-2024-001",
      pattern_match_score: 87,
      similar_case_reference_ids: [
        "CASE-2023-100",
        "CASE-2023-045",
        "CASE-2022-288",
      ],
      success_factors: [
        {
          factor_name: "初期課題ヒアリング充実度",
          weight: 0.35,
          achievement_rate: 0.92,
        },
        {
          factor_name: "提案資料のカスタマイズ度",
          weight: 0.3,
          achievement_rate: 0.88,
        },
        {
          factor_name: "意思決定者との接触回数",
          weight: 0.25,
          achievement_rate: 0.85,
        },
        {
          factor_name: "競合対策の事前準備",
          weight: 0.1,
          achievement_rate: 0.78,
        },
      ],
      failure_risk_factors: [
        {
          risk_name: "予算承認遅延",
          probability: 0.15,
          impact_level: "high",
        },
        {
          risk_name: "要件仕様の不明確性",
          probability: 0.12,
          impact_level: "medium",
        },
        {
          risk_name: "競合による代替提案",
          probability: 0.08,
          impact_level: "high",
        },
      ],
      recommended_approach: {
        approach_id: "APPROACH-2024-001",
        approach_name: "段階的導入型提案",
        estimated_conversion_rate: 0.72,
      },
      generation_timestamp: "2024-08-01T09:30:00Z",
    };

    const mockAIEngine = {
      generateRecommendation: async (condition: typeof dealCondition) => {
        return mockRecommendationRationale;
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockRecommendationRationale), {
      status: 200,
    });

    const firstVisualizationResult = await visualizeRecommendationRationale(
      dealCondition,
      mockAIEngine
    );

    fetchMock.mockResponseOnce(JSON.stringify(mockRecommendationRationale), {
      status: 200,
    });

    const secondVisualizationResult = await visualizeRecommendationRationale(
      dealCondition,
      mockAIEngine
    );

    expect(firstVisualizationResult).toEqual(secondVisualizationResult);

    expect(firstVisualizationResult.rationale_id).toBe("RATIONALE-2024-001");
    expect(firstVisualizationResult.pattern_match_score).toBe(87);

    expect(firstVisualizationResult.visualization).toHaveProperty(
      "dom_structure"
    );
    expect(firstVisualizationResult.visualization).toHaveProperty(
      "svg_commands"
    );
    expect(firstVisualizationResult.visualization).toHaveProperty(
      "color_codes"
    );
    expect(firstVisualizationResult.visualization).toHaveProperty(
      "numeric_formats"
    );
    expect(firstVisualizationResult.visualization).toHaveProperty(
      "layout_coordinates"
    );
    expect(firstVisualizationResult.visualization).toHaveProperty(
      "text_labels"
    );

    expect(firstVisualizationResult.visualization.dom_structure).toBe(
      secondVisualizationResult.visualization.dom_structure
    );
    expect(firstVisualizationResult.visualization.svg_commands).toBe(
      secondVisualizationResult.visualization.svg_commands
    );
    expect(firstVisualizationResult.visualization.color_codes).toEqual(
      secondVisualizationResult.visualization.color_codes
    );
    expect(firstVisualizationResult.visualization.numeric_formats).toEqual(
      secondVisualizationResult.visualization.numeric_formats
    );
    expect(firstVisualizationResult.visualization.layout_coordinates).toEqual(
      secondVisualizationResult.visualization.layout_coordinates
    );
    expect(firstVisualizationResult.visualization.text_labels).toEqual(
      secondVisualizationResult.visualization.text_labels
    );

    expect(firstVisualizationResult.success_factors_visualization).toEqual(
      secondVisualizationResult.success_factors_visualization
    );
    expect(
      firstVisualizationResult.success_factors_visualization[0].factor_name
    ).toBe("初期課題ヒアリング充実度");
    expect(
      firstVisualizationResult.success_factors_visualization[0].weight
    ).toBe(0.35);
    expect(
      firstVisualizationResult.success_factors_visualization[0]
        .achievement_rate
    ).toBe(0.92);

    expect(
      firstVisualizationResult.failure_risk_factors_visualization
    ).toEqual(
      secondVisualizationResult.failure_risk_factors_visualization
    );
    expect(
      firstVisualizationResult.failure_risk_factors_visualization[0].risk_name
    ).toBe("予算承認遅延");
    expect(
      firstVisualizationResult.failure_risk_factors_visualization[0]
        .probability
    ).toBe(0.15);
    expect(
      firstVisualizationResult.failure_risk_factors_visualization[0]
        .impact_level
    ).toBe("high");

    expect(
      firstVisualizationResult.recommended_approach_visualization
    ).toEqual(secondVisualizationResult.recommended_approach_visualization);
    expect(
      firstVisualizationResult.recommended_approach_visualization
        .estimated_conversion_rate
    ).toBe(0.72);

    expect(
      firstVisualizationResult.visualization.determinism_check
    ).toBeDefined();
    expect(
      secondVisualizationResult.visualization.determinism_check
    ).toBeDefined();
    expect(firstVisualizationResult.visualization.determinism_check).toBe(
      secondVisualizationResult.visualization.determinism_check
    );

    expect(fetchMock.mock.calls.length).toBe(2);
  });
});