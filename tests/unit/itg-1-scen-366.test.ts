import {
  generateBehaviorPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-366
  test("分析対象期間が年度を跨るとき、正しく集計される", async () => {
    const salesPersonId = "sales_001";
    const analysisStartDate = "2024-01-01";
    const analysisEndDate = "2024-12-31";

    // 前年度（2023年4月1日～2024年3月31日）の営業活動実績データ100件を作成
    const prevYearActivities = Array.from({ length: 100 }, (_, i) => ({
      activity_id: `prev_${i + 1}`,
      sales_person_id: salesPersonId,
      activity_date: new Date(2023, 3 + Math.floor(i / 10), 1 + (i % 10))
        .toISOString()
        .split("T")[0],
      activity_type: "訪問",
      customer_id: `cust_${i + 1}`,
      result: "実施",
      notes: `Previous fiscal year activity ${i + 1}`,
    }));

    // 当年度（2024年4月1日～2025年3月31日）の営業活動実績データ80件を作成
    const currentYearActivities = Array.from({ length: 80 }, (_, i) => ({
      activity_id: `curr_${i + 1}`,
      sales_person_id: salesPersonId,
      activity_date: new Date(2024, 3 + Math.floor(i / 10), 1 + (i % 10))
        .toISOString()
        .split("T")[0],
      activity_type: "訪問",
      customer_id: `cust_${100 + i + 1}`,
      result: "実施",
      notes: `Current fiscal year activity ${i + 1}`,
    }));

    // すべての活動データを統合
    const allActivities = [...prevYearActivities, ...currentYearActivities];

    // 分析対象期間に該当するデータを抽出
    const targetActivities = allActivities.filter((act) => {
      const actDate = act.activity_date;
      return (
        actDate >= analysisStartDate &&
        actDate <= analysisEndDate &&
        act.sales_person_id === salesPersonId
      );
    });

    // 2024年1月～3月分（前年度から60件）と4月～12月分（当年度から70件）を期待
    const expectedData = targetActivities.filter(
      (act) =>
        (act.activity_date >= "2024-01-01" &&
          act.activity_date <= "2024-03-31") ||
        (act.activity_date >= "2024-04-01" &&
          act.activity_date <= "2024-12-31")
    );

    const report = await generateBehaviorPatternAnalysisReport({
      sales_person_id: salesPersonId,
      analysis_start_date: analysisStartDate,
      analysis_end_date: analysisEndDate,
      activities: allActivities,
    });

    // 集計対象期間内のデータ件数を検証（期待値：130件）
    expect(report.total_activities_count).toBe(130);

    // 前年度データと当年度データが正しく分離されているか確認
    expect(report.fy_2024_q1_q3_count).toBe(60); // 2024年1月～3月
    expect(report.fy_2025_q1_q3_count).toBe(70); // 2024年4月～12月

    // 月別集計値を検証
    expect(report.monthly_aggregation).toEqual({
      "2024-01": expect.any(Number),
      "2024-02": expect.any(Number),
      "2024-03": expect.any(Number),
      "2024-04": expect.any(Number),
      "2024-05": expect.any(Number),
      "2024-06": expect.any(Number),
      "2024-07": expect.any(Number),
      "2024-08": expect.any(Number),
      "2024-09": expect.any(Number),
      "2024-10": expect.any(Number),
      "2024-11": expect.any(Number),
      "2024-12": expect.any(Number),
    });

    // 訪問件数合計値を検証（期待値：130件 - すべてが訪問）
    expect(report.total_visit_count).toBe(130);

    // 分析対象期間の検証
    expect(report.analysis_period_start).toBe("2024-01-01");
    expect(report.analysis_period_end).toBe("2024-12-31");

    // 営業担当者IDの検証
    expect(report.sales_person_id).toBe(salesPersonId);

    // 前年度と当年度のデータが正しく統合されているか
    expect(report.fiscal_year_boundary_crossing).toBe(true);
  });
});