import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { AIRecommendationEngine } from "../../src/logic/it-1-br-3-1-1-1";
import { visualizeAnomalousPatterns } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨根拠の可視化機能 - 月をまたいだデータ集計", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-2310
  test("対象期間が月末から月初に跨る場合、月をまたいだ顧客対応パターンデータが正確に集計される", async () => {
    // 準備: 1月31日のデータ（5件）
    const jan_31_patterns = [
      {
        id: "pattern_001",
        date: "2024-01-31",
        customer_interaction_type: "follow_up",
        proposal_content: "Product A upgrade proposal",
        deviation_from_standard: 0.12,
        is_anomalous: false,
      },
      {
        id: "pattern_002",
        date: "2024-01-31",
        customer_interaction_type: "negotiation",
        proposal_content: "Pricing negotiation",
        deviation_from_standard: 0.25,
        is_anomalous: true,
      },
      {
        id: "pattern_003",
        date: "2024-01-31",
        customer_interaction_type: "discovery",
        proposal_content: "Initial needs assessment",
        deviation_from_standard: 0.05,
        is_anomalous: false,
      },
      {
        id: "pattern_004",
        date: "2024-01-31",
        customer_interaction_type: "follow_up",
        proposal_content: "Second follow-up contact",
        deviation_from_standard: 0.18,
        is_anomalous: false,
      },
      {
        id: "pattern_005",
        date: "2024-01-31",
        customer_interaction_type: "proposal_presentation",
        proposal_content: "Formal proposal presentation",
        deviation_from_standard: 0.33,
        is_anomalous: true,
      },
    ];

    // 準備: 2月1日のデータ（3件）
    const feb_01_patterns = [
      {
        id: "pattern_006",
        date: "2024-02-01",
        customer_interaction_type: "follow_up",
        proposal_content: "Post-presentation follow-up",
        deviation_from_standard: 0.22,
        is_anomalous: true,
      },
      {
        id: "pattern_007",
        date: "2024-02-01",
        customer_interaction_type: "closing",
        proposal_content: "Contract negotiation",
        deviation_from_standard: 0.08,
        is_anomalous: false,
      },
      {
        id: "pattern_008",
        date: "2024-02-01",
        customer_interaction_type: "follow_up",
        proposal_content: "Final confirmation",
        deviation_from_standard: 0.15,
        is_anomalous: false,
      },
    ];

    // AIRecommendationEngine スタブ: 月をまたいだデータを返す
    const mockAIEngine: Partial<AIRecommendationEngine> = {
      analyzeCustomerPatterns: jest.fn(async (startDate, endDate) => {
        return {
          patterns: [...jan_31_patterns, ...feb_01_patterns],
          period_start: startDate,
          period_end: endDate,
          total_count: 8,
        };
      }),
    };

    // テスト対象関数を実行
    const start_date = "2024-01-31";
    const end_date = "2024-02-01";

    const report = await visualizeAnomalousPatterns(
      start_date,
      end_date,
      mockAIEngine as AIRecommendationEngine
    );

    // 検証1: 対象期間が正確に記録されているか
    expect(report.aggregation_period.start_date).toBe("2024-01-31");
    expect(report.aggregation_period.end_date).toBe("2024-02-01");
    expect(report.aggregation_period.display_text).toBe(
      "2024-01-31 ～ 2024-02-01"
    );

    // 検証2: 対応パターン総件数が8件である
    expect(report.total_pattern_count).toBe(8);

    // 検証3: 月別の内訳が正しく分離されているか
    expect(report.monthly_breakdown.january_2024.count).toBe(5);
    expect(report.monthly_breakdown.february_2024.count).toBe(3);

    // 検証4: 月別サマリーの表示形式が正しいか
    expect(report.monthly_breakdown.january_2024.display_text).toBe(
      "1月: 5件"
    );
    expect(report.monthly_breakdown.february_2024.display_text).toBe(
      "2月: 3件"
    );

    // 検証5: 集計レポート内に両月のデータが統合されているか
    expect(report.all_patterns).toHaveLength(8);

    // 検証6: 各パターンの日付が正しく区別されているか
    const jan_patterns_in_report = report.all_patterns.filter(
      (p) => p.date === "2024-01-31"
    );
    const feb_patterns_in_report = report.all_patterns.filter(
      (p) => p.date === "2024-02-01"
    );

    expect(jan_patterns_in_report).toHaveLength(5);
    expect(feb_patterns_in_report).toHaveLength(3);

    // 検証7: 異常パターンの集計も正しいか
    const anomalous_total = report.all_patterns.filter(
      (p) => p.is_anomalous === true
    ).length;
    expect(anomalous_total).toBe(3); // pattern_002, pattern_005, pattern_006
  });
});