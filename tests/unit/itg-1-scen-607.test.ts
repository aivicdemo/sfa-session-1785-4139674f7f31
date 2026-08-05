import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-607
  test("[normal] 営業担当者が提案を複数件入力した場合、すべてのデータが分析対象に含まれレポートが生成される", () => {
    const sales_person_id = "SP-001";
    const sales_person_name = "営業担当者A";
    const proposals = [
      {
        proposal_id: "PROP-001",
        amount: 500000,
        product_name: "製品X",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        proposal_id: "PROP-002",
        amount: 300000,
        product_name: "製品Y",
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        proposal_id: "PROP-003",
        amount: 800000,
        product_name: "製品Z",
        created_at: "2024-01-15T11:00:00Z",
      },
    ];

    const input = {
      sales_person_id,
      sales_person_name,
      proposals,
      report_period_start: "2024-01-01T00:00:00Z",
      report_period_end: "2024-01-31T23:59:59Z",
    };

    const result = generateSalesActivityPatternAnalysisReport(input);

    expect(result).toEqual({
      report_id: expect.any(String),
      sales_person_id: "SP-001",
      sales_person_name: "営業担当者A",
      total_proposal_count: 3,
      total_proposal_amount: 1600000,
      proposal_details: [
        {
          proposal_id: "PROP-001",
          amount: 500000,
          product_name: "製品X",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          proposal_id: "PROP-002",
          amount: 300000,
          product_name: "製品Y",
          created_at: "2024-01-15T10:30:00Z",
        },
        {
          proposal_id: "PROP-003",
          amount: 800000,
          product_name: "製品Z",
          created_at: "2024-01-15T11:00:00Z",
        },
      ],
      activity_pattern_analysis: {
        proposal_frequency_per_day: 3,
        average_time_interval_minutes: expect.any(Number),
        product_diversity_count: 3,
      },
      generated_at: expect.any(String),
      report_status: "completed",
    });

    expect(result.total_proposal_count).toBe(3);
    expect(result.total_proposal_amount).toBe(1600000);
    expect(result.proposal_details).toHaveLength(3);
    expect(result.proposal_details[0].proposal_id).toBe("PROP-001");
    expect(result.proposal_details[0].amount).toBe(500000);
    expect(result.proposal_details[0].product_name).toBe("製品X");
    expect(result.proposal_details[1].proposal_id).toBe("PROP-002");
    expect(result.proposal_details[1].amount).toBe(300000);
    expect(result.proposal_details[1].product_name).toBe("製品Y");
    expect(result.proposal_details[2].proposal_id).toBe("PROP-003");
    expect(result.proposal_details[2].amount).toBe(800000);
    expect(result.proposal_details[2].product_name).toBe("製品Z");
    expect(result.activity_pattern_analysis.product_diversity_count).toBe(3);
    expect(result.report_status).toBe("completed");
  });
});