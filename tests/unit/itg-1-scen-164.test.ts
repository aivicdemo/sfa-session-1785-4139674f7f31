import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-164: 商談記録の入力期間が年度をまたぐとき、正常に計算される", () => {
    // 営業担当者Aの商談記録をテストデータとして作成
    const salesPersonId = "sales_person_a";
    const salesPersonName = "営業担当者A";

    // 1件目の商談記録：記録日=2024年3月15日、商談金額=100万円
    const dealRecord1 = {
      id: "deal_record_1",
      salesPersonId: salesPersonId,
      recordDate: "2024-03-15",
      dealAmount: 1000000,
    };

    // 2件目の商談記録：記録日=2024年4月10日、商談金額=150万円
    const dealRecord2 = {
      id: "deal_record_2",
      salesPersonId: salesPersonId,
      recordDate: "2024-04-10",
      dealAmount: 1500000,
    };

    // 分析期間を「2024年度（2024年4月1日～2025年3月31日）」として指定
    const analysisStartDate = "2024-04-01";
    const analysisEndDate = "2025-03-31";

    // 行動パターン分析レポート生成機能を実行
    const report = generateSalesActivityPatternReport({
      salesPersonId: salesPersonId,
      salesPersonName: salesPersonName,
      dealRecords: [dealRecord1, dealRecord2],
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
    });

    // 生成されたレポートから、営業担当者Aの商談金額集計値を確認
    // 期待結果: 2024年度の商談金額集計が150万円として計算されること
    // すなわち、前年度（2024年3月15日）の商談記録は除外され、当年度（2024年4月10日）の商談記録のみがレポートに含まれる
    expect(report.totalDealAmount).toBe(1500000);
  });
});