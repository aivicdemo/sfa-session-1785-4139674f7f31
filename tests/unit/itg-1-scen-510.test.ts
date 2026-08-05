import {
  analyzeSalesPersonBehaviorPatterns,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-510: 同一成約実績の複数営業担当者が重複なく行動パターン分析に含まれる", () => {
    // Arrange: テストデータの準備
    const closedDealId = "deal_12345";
    const salesPersonA_id = "sp_001";
    const salesPersonB_id = "sp_002";
    const salesPersonC_id = "sp_003";

    const activityRecords = [
      {
        activity_id: "act_001",
        sales_person_id: salesPersonA_id,
        deal_id: closedDealId,
        activity_date: "2024-01-05T09:00:00Z",
        activity_type: "phone_call",
        contact_frequency: 3,
        follow_up_interval_days: 2,
      },
      {
        activity_id: "act_002",
        sales_person_id: salesPersonA_id,
        deal_id: closedDealId,
        activity_date: "2024-01-07T10:30:00Z",
        activity_type: "phone_call",
        contact_frequency: 3,
        follow_up_interval_days: 2,
      },
      {
        activity_id: "act_003",
        sales_person_id: salesPersonA_id,
        deal_id: closedDealId,
        activity_date: "2024-01-09T14:15:00Z",
        activity_type: "proposal",
        contact_frequency: 3,
        follow_up_interval_days: 2,
      },
      {
        activity_id: "act_004",
        sales_person_id: salesPersonB_id,
        deal_id: closedDealId,
        activity_date: "2024-01-05T11:00:00Z",
        activity_type: "email",
        contact_frequency: 2,
        follow_up_interval_days: 4,
      },
      {
        activity_id: "act_005",
        sales_person_id: salesPersonB_id,
        deal_id: closedDealId,
        activity_date: "2024-01-09T16:45:00Z",
        activity_type: "email",
        contact_frequency: 2,
        follow_up_interval_days: 4,
      },
      {
        activity_id: "act_006",
        sales_person_id: salesPersonC_id,
        deal_id: closedDealId,
        activity_date: "2024-01-06T08:30:00Z",
        activity_type: "visit",
        contact_frequency: 1,
        follow_up_interval_days: 3,
      },
      {
        activity_id: "act_007",
        sales_person_id: salesPersonC_id,
        deal_id: closedDealId,
        activity_date: "2024-01-09T13:00:00Z",
        activity_type: "proposal",
        contact_frequency: 1,
        follow_up_interval_days: 3,
      },
    ];

    const analysisStartDate = "2024-01-05T00:00:00Z";
    const analysisEndDate = "2024-01-10T00:00:00Z";

    // Act: 行動パターン分析レポート生成
    const report = analyzeSalesPersonBehaviorPatterns({
      activity_records: activityRecords,
      deal_id: closedDealId,
      analysis_start_date: analysisStartDate,
      analysis_end_date: analysisEndDate,
    });

    // Assert: 営業担当者ごとの分析結果が重複なく含まれているか確認
    expect(report.analysis_results).toBeDefined();
    expect(report.analysis_results.length).toBe(3);

    // 営業担当者IDの一覧を抽出
    const analyzed_sales_person_ids = report.analysis_results.map(
      (result) => result.sales_person_id
    );

    // 営業担当者A、B、Cがそれぞれ1回ずつ含まれていることを確認
    expect(analyzed_sales_person_ids).toContain(salesPersonA_id);
    expect(analyzed_sales_person_ids).toContain(salesPersonB_id);
    expect(analyzed_sales_person_ids).toContain(salesPersonC_id);

    // 営業担当者IDの重複がないことを確認
    const unique_ids = new Set(analyzed_sales_person_ids);
    expect(unique_ids.size).toBe(3);

    // 各営業担当者の分析結果を確認
    const resultA = report.analysis_results.find(
      (r) => r.sales_person_id === salesPersonA_id
    );
    expect(resultA).toBeDefined();
    expect(resultA!.deal_id).toBe(closedDealId);
    expect(resultA!.contact_frequency).toBe(3);
    expect(resultA!.follow_up_interval_days).toBe(2);
    expect(resultA!.activity_types).toContain("phone_call");
    expect(resultA!.activity_types).toContain("proposal");

    const resultB = report.analysis_results.find(
      (r) => r.sales_person_id === salesPersonB_id
    );
    expect(resultB).toBeDefined();
    expect(resultB!.deal_id).toBe(closedDealId);
    expect(resultB!.contact_frequency).toBe(2);
    expect(resultB!.follow_up_interval_days).toBe(4);
    expect(resultB!.activity_types).toContain("email");

    const resultC = report.analysis_results.find(
      (r) => r.sales_person_id === salesPersonC_id
    );
    expect(resultC).toBeDefined();
    expect(resultC!.deal_id).toBe(closedDealId);
    expect(resultC!.contact_frequency).toBe(1);
    expect(resultC!.follow_up_interval_days).toBe(3);
    expect(resultC!.activity_types).toContain("visit");
    expect(resultC!.activity_types).toContain("proposal");

    // 各営業担当者ごとに異なる行動パターン分析結果が記録されていることを確認
    expect(resultA!.contact_frequency).not.toBe(resultB!.contact_frequency);
    expect(resultB!.contact_frequency).not.toBe(resultC!.contact_frequency);
    expect(resultA!.follow_up_interval_days).not.toBe(
      resultB!.follow_up_interval_days
    );
    expect(resultB!.follow_up_interval_days).not.toBe(
      resultC!.follow_up_interval_days
    );

    // レポート全体の統計情報を確認
    expect(report.total_analyzed_sales_persons).toBe(3);
    expect(report.target_deal_id).toBe(closedDealId);
  });
});