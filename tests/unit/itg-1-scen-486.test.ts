import {
  analyzeBehaviorPatterns,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-486: 行動パターン分析結果がテーブルに正しく記録される", async () => {
    // 過去3ヶ月分の行動データをモックデータとして準備
    const analysisStartDate = new Date("2024-09-01T00:00:00Z");
    const analysisEndDate = new Date("2024-11-30T23:59:59Z");

    const behaviorData = [
      {
        sales_person_id: "SP001",
        sales_person_name: "営業担当者A",
        visit_count: 48, // 3ヶ月間で48回訪問 = 週3.2回
        proposal_count: 36,
        contract_count: 3,
        avg_response_time_minutes: 180,
        period_start: analysisStartDate,
        period_end: analysisEndDate,
      },
      {
        sales_person_id: "SP002",
        sales_person_name: "営業担当者B",
        visit_count: 24, // 3ヶ月間で24回訪問 = 週1.6回
        proposal_count: 18,
        contract_count: 2,
        avg_response_time_minutes: 240,
        period_start: analysisStartDate,
        period_end: analysisEndDate,
      },
      {
        sales_person_id: "SP003",
        sales_person_name: "営業担当者C",
        visit_count: 36, // 3ヶ月間で36回訪問 = 週2.4回
        proposal_count: 27,
        contract_count: 2,
        avg_response_time_minutes: 210,
        period_start: analysisStartDate,
        period_end: analysisEndDate,
      },
    ];

    // 行動パターン分析レポート生成機能を実行
    const result = await analyzeBehaviorPatterns({
      behavior_data: behaviorData,
      analysis_period_start: analysisStartDate,
      analysis_period_end: analysisEndDate,
    });

    // 挿入されたレコードが3件であることを確認
    expect(result.records_inserted).toBe(3);

    // 営業担当者A の分析結果を検証
    const recordA = result.analysis_results.find(
      (r: any) => r.sales_person_id === "SP001"
    );
    expect(recordA).toBeDefined();
    expect(recordA.sales_person_id).toBe("SP001");
    expect(recordA.sales_person_name).toBe("営業担当者A");
    expect(recordA.analysis_period_start).toEqual(
      new Date("2024-09-01T00:00:00Z")
    );
    expect(recordA.analysis_period_end).toEqual(
      new Date("2024-11-30T23:59:59Z")
    );
    expect(recordA.visit_frequency_pattern).toBe("週3.2回");
    expect(recordA.avg_days_proposal_to_contract).toBe(12);
    expect(recordA.behavior_pattern_classification).toBe("アグレッシブ型");
    expect(recordA.executed_at).toEqual(new Date("2024-12-15T10:00:00Z"));

    // 営業担当者B の分析結果を検証
    const recordB = result.analysis_results.find(
      (r: any) => r.sales_person_id === "SP002"
    );
    expect(recordB).toBeDefined();
    expect(recordB.sales_person_id).toBe("SP002");
    expect(recordB.sales_person_name).toBe("営業担当者B");
    expect(recordB.analysis_period_start).toEqual(
      new Date("2024-09-01T00:00:00Z")
    );
    expect(recordB.analysis_period_end).toEqual(
      new Date("2024-11-30T23:59:59Z")
    );
    expect(recordB.visit_frequency_pattern).toBe("週1.6回");
    expect(recordB.avg_days_proposal_to_contract).toBe(18);
    expect(recordB.behavior_pattern_classification).toBe("保守型");
    expect(recordB.executed_at).toEqual(new Date("2024-12-15T10:00:00Z"));

    // 営業担当者C の分析結果を検証
    const recordC = result.analysis_results.find(
      (r: any) => r.sales_person_id === "SP003"
    );
    expect(recordC).toBeDefined();
    expect(recordC.sales_person_id).toBe("SP003");
    expect(recordC.sales_person_name).toBe("営業担当者C");
    expect(recordC.analysis_period_start).toEqual(
      new Date("2024-09-01T00:00:00Z")
    );
    expect(recordC.analysis_period_end).toEqual(
      new Date("2024-11-30T23:59:59Z")
    );
    expect(recordC.visit_frequency_pattern).toBe("週2.4回");
    expect(recordC.avg_days_proposal_to_contract).toBe(15);
    expect(recordC.behavior_pattern_classification).toBe("バランス型");
    expect(recordC.executed_at).toEqual(new Date("2024-12-15T10:00:00Z"));

    // すべてのレコードが正常に保存されたことを確認
    expect(result.status).toBe("success");
    expect(result.analysis_results.length).toBe(3);
  });
});