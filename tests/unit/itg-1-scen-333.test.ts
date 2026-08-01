import {
  analyzeSellerActionPatterns,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-333: 営業担当者が1人の場合、その担当者のみのレポートが生成される", () => {
    // 準備: 営業担当者1人のみ
    const seller = {
      seller_id: "S001",
      seller_name: "田中太郎",
      department: "東京営業部",
    };

    // 営業活動データ3件（訪問記録、提案内容、成約情報を含む）
    const activities = [
      {
        activity_id: "A001",
        seller_id: "S001",
        activity_type: "visit",
        customer_id: "C001",
        activity_date: new Date("2024-01-10T10:00:00Z"),
        duration_minutes: 60,
      },
      {
        activity_id: "A002",
        seller_id: "S001",
        activity_type: "proposal",
        customer_id: "C002",
        activity_date: new Date("2024-01-15T14:30:00Z"),
        proposal_amount: 500000,
      },
      {
        activity_id: "A003",
        seller_id: "S001",
        activity_type: "contract",
        customer_id: "C001",
        activity_date: new Date("2024-01-20T11:00:00Z"),
        contract_amount: 500000,
      },
    ];

    // 行動パターン分析レポート生成を実行
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");

    const report = analyzeSellerActionPatterns({
      sellers: [seller],
      activities: activities,
      period_start: analysisStartDate,
      period_end: analysisEndDate,
    });

    // 期待結果の検証
    // レポートには1人分のデータのみが含まれる
    expect(report.seller_count).toBe(1);

    // 対象営業担当者のレポート内容を検証
    expect(report.sellers_analysis).toHaveLength(1);

    const sellerAnalysis = report.sellers_analysis[0];
    expect(sellerAnalysis.seller_id).toBe("S001");
    expect(sellerAnalysis.seller_name).toBe("田中太郎");

    // 行動パターン分類が存在
    expect(sellerAnalysis.action_pattern_type).toBeDefined();
    expect(
      ["積極型", "慎重型", "標準型"].includes(sellerAnalysis.action_pattern_type)
    ).toBe(true);

    // 訪問件数: 3件中1件
    expect(sellerAnalysis.visit_count).toBe(1);

    // 提案件数: 3件中1件
    expect(sellerAnalysis.proposal_count).toBe(1);

    // 成約件数: 3件中1件
    expect(sellerAnalysis.contract_count).toBe(1);

    // 他の営業担当者のデータが含まれていないことを確認
    const otherSellerAnalysis = report.sellers_analysis.filter(
      (sa) => sa.seller_id !== "S001"
    );
    expect(otherSellerAnalysis).toHaveLength(0);

    // レポート生成日時が正常に記録されている
    expect(report.generated_at).toBeDefined();
    expect(typeof report.generated_at).toBe("string");
  });
});