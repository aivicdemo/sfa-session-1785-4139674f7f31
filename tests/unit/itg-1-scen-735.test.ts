import { selectReportingDataForSalesDirector } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-735
  test("成功パターン適用ガイドラインの周知完了判定機能 - 営業部長への報告対象データが正しく選定される", () => {
    const now = new Date("2024-12-15T10:00:00Z");
    const ninetyDaysAgo = new Date("2024-09-17T10:00:00Z");
    const outOfRangeDate = new Date("2024-09-16T10:00:00Z");

    const approvedGuideline = {
      guideline_id: "GL-001",
      created_at: new Date("2024-12-10T09:00:00Z"),
      status: "approved",
      success_patterns: [
        {
          pattern_id: "P-001",
          name: "初期接触後72時間フォローアップ",
          description: "初期接触から72時間以内にフォローアップを実施",
          applicability_score: 0.92,
        },
        {
          pattern_id: "P-002",
          name: "複数提案による比較検討",
          description: "顧客に複数の提案肢を同時に提示",
          applicability_score: 0.88,
        },
        {
          pattern_id: "P-003",
          name: "経営課題ヒアリング優先",
          description: "提案前に顧客の経営課題を詳細ヒアリング",
          applicability_score: 0.95,
        },
      ],
    };

    const successExamplesWithinRange = [
      {
        deal_id: "DEAL-001",
        account_name: "顧客A",
        sales_rep_id: "REP-001",
        deal_date: new Date("2024-12-05T14:00:00Z"),
        deal_amount: 5000000,
        matched_pattern_ids: ["P-001", "P-002"],
        success: true,
      },
      {
        deal_id: "DEAL-002",
        account_name: "顧客B",
        sales_rep_id: "REP-002",
        deal_date: new Date("2024-11-20T11:30:00Z"),
        deal_amount: 3200000,
        matched_pattern_ids: ["P-003"],
        success: true,
      },
      {
        deal_id: "DEAL-003",
        account_name: "顧客C",
        sales_rep_id: "REP-001",
        deal_date: new Date("2024-10-15T09:15:00Z"),
        deal_amount: 4100000,
        matched_pattern_ids: ["P-001"],
        success: true,
      },
      {
        deal_id: "DEAL-004",
        account_name: "顧客D",
        sales_rep_id: "REP-003",
        deal_date: new Date("2024-09-25T13:45:00Z"),
        deal_amount: 2800000,
        matched_pattern_ids: ["P-002", "P-003"],
        success: true,
      },
    ];

    const successExamplesOutOfRange = [
      {
        deal_id: "DEAL-OLD-001",
        account_name: "顧客old",
        sales_rep_id: "REP-004",
        deal_date: outOfRangeDate,
        deal_amount: 1500000,
        matched_pattern_ids: ["P-001"],
        success: true,
      },
    ];

    const inputData = {
      approved_guideline: approvedGuideline,
      success_examples: [
        ...successExamplesWithinRange,
        ...successExamplesOutOfRange,
      ],
      reference_date: now,
      date_range_days: 90,
    };

    const result = selectReportingDataForSalesDirector(inputData);

    expect(result.status).toBe("ready");
    expect(result.guideline_id).toBe("GL-001");
    expect(result.guideline_status).toBe("approved");

    expect(result.included_patterns.length).toBe(3);
    expect(result.included_patterns.some((p) => p.pattern_id === "P-001")).toBe(
      true
    );
    expect(result.included_patterns.some((p) => p.pattern_id === "P-002")).toBe(
      true
    );
    expect(result.included_patterns.some((p) => p.pattern_id === "P-003")).toBe(
      true
    );

    expect(result.selected_examples.length).toBe(4);

    const exampleIds = result.selected_examples.map((ex) => ex.deal_id);
    expect(exampleIds).toContain("DEAL-001");
    expect(exampleIds).toContain("DEAL-002");
    expect(exampleIds).toContain("DEAL-003");
    expect(exampleIds).toContain("DEAL-004");
    expect(exampleIds).not.toContain("DEAL-OLD-001");

    expect(result.pattern_coverage).toEqual({
      P001_count: 2,
      P002_count: 2,
      P003_count: 2,
    });

    result.selected_examples.forEach((example) => {
      expect(example.matched_pattern_ids.length).toBeGreaterThanOrEqual(1);
    });

    expect(result.generated_at).toEqual(new Date("2024-12-10T09:00:00Z"));
    expect(result.report_ready).toBe(true);
  });
});