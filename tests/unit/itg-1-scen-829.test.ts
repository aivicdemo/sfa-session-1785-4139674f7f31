import {
  analyzeProcessDeviation,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-829
  test("標準プロセスからの乖離度を0～100の数値で正確に算出する", () => {
    const standard_process_definition = {
      steps: [
        { step_id: 1, step_name: "初期接触" },
        { step_id: 2, step_name: "ニーズ把握" },
        { step_id: 3, step_name: "提案" },
        { step_id: 4, step_name: "交渉" },
        { step_id: 5, step_name: "成約" },
      ],
    };

    const sales_opportunities = [
      {
        opportunity_id: "OPP001",
        executed_steps: [1, 2, 3, 4, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP002",
        executed_steps: [1, 2, 3, 4, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP003",
        executed_steps: [1, 2, 3, 4, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP004",
        executed_steps: [1, 2, 3, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP005",
        executed_steps: [1, 3, 4, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP006",
        executed_steps: [1, 2, 4, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP007",
        executed_steps: [1, 2, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP008",
        executed_steps: [1, 3, 5],
        additional_steps: [],
      },
      {
        opportunity_id: "OPP009",
        executed_steps: [1, 2, 3, 4, 5],
        additional_steps: [6, 7],
      },
      {
        opportunity_id: "OPP010",
        executed_steps: [1, 2, 3, 4, 5],
        additional_steps: [6, 7],
      },
    ];

    const result = analyzeProcessDeviation({
      standard_process_definition,
      sales_opportunities,
    });

    expect(result.analysis_results).toHaveLength(10);

    const deviation_scores = result.analysis_results.map((r: any) => ({
      opportunity_id: r.opportunity_id,
      deviation_score: r.deviation_score,
    }));

    const opp001 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP001"
    );
    expect(opp001.deviation_score).toBe(0);

    const opp002 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP002"
    );
    expect(opp002.deviation_score).toBe(0);

    const opp003 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP003"
    );
    expect(opp003.deviation_score).toBe(0);

    const opp004 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP004"
    );
    expect(Math.abs(opp004.deviation_score - 20)).toBeLessThanOrEqual(2);

    const opp005 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP005"
    );
    expect(Math.abs(opp005.deviation_score - 20)).toBeLessThanOrEqual(2);

    const opp006 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP006"
    );
    expect(Math.abs(opp006.deviation_score - 20)).toBeLessThanOrEqual(2);

    const opp007 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP007"
    );
    expect(Math.abs(opp007.deviation_score - 40)).toBeLessThanOrEqual(2);

    const opp008 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP008"
    );
    expect(Math.abs(opp008.deviation_score - 40)).toBeLessThanOrEqual(2);

    const opp009 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP009"
    );
    expect(Math.abs(opp009.deviation_score - 20)).toBeLessThanOrEqual(2);

    const opp010 = deviation_scores.find(
      (d: any) => d.opportunity_id === "OPP010"
    );
    expect(Math.abs(opp010.deviation_score - 20)).toBeLessThanOrEqual(2);

    result.analysis_results.forEach((analysis_result: any) => {
      expect(analysis_result).toHaveProperty("opportunity_id");
      expect(analysis_result).toHaveProperty("deviation_score");
      expect(analysis_result).toHaveProperty("standard_steps");
      expect(analysis_result).toHaveProperty("executed_steps");
      expect(analysis_result).toHaveProperty("additional_steps_count");
      expect(analysis_result).toHaveProperty("calculation_basis");

      expect(typeof analysis_result.opportunity_id).toBe("string");
      expect(typeof analysis_result.deviation_score).toBe("number");
      expect(Array.isArray(analysis_result.standard_steps)).toBe(true);
      expect(Array.isArray(analysis_result.executed_steps)).toBe(true);
      expect(typeof analysis_result.additional_steps_count).toBe("number");
      expect(typeof analysis_result.calculation_basis).toBe("object");

      expect(analysis_result.deviation_score).toBeGreaterThanOrEqual(0);
      expect(analysis_result.deviation_score).toBeLessThanOrEqual(100);

      expect(analysis_result.calculation_basis).toHaveProperty(
        "standard_step_count"
      );
      expect(analysis_result.calculation_basis).toHaveProperty(
        "executed_step_count"
      );
      expect(analysis_result.calculation_basis).toHaveProperty(
        "compliance_ratio"
      );
      expect(analysis_result.calculation_basis).toHaveProperty(
        "step_omission_penalty"
      );
      expect(analysis_result.calculation_basis).toHaveProperty(
        "additional_step_penalty"
      );
    });
  });
});