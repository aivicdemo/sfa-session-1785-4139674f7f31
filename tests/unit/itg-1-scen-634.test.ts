import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-634: 乖離度が±15%を超える場合、改善優先度が「高」に判定される", () => {
    const standard_behavior = {
      initial_contact_rate: 80,
      proposal_creation_rate: 70,
      contract_rate: 50,
    };

    const actual_behavior = {
      initial_contact_rate: 62,
      proposal_creation_rate: 58,
      contract_rate: 30,
    };

    const salesperson_id = "SP001";

    const report = generateBehaviorPatternAnalysisReport(
      salesperson_id,
      standard_behavior,
      actual_behavior
    );

    // 期待される乖離度の計算
    // 初回接触率: (62 - 80) = -18%
    // 提案書作成率: (58 - 70) = -12%
    // 成約率: (30 - 50) = -20%

    // 乖離度が±15%を超えるメトリクスの確認
    expect(report.salesperson_id).toBe("SP001");

    // 初回接触率の乖離度が-18%（±15%を超える）
    expect(report.metrics[0].name).toBe("initial_contact_rate");
    expect(report.metrics[0].standard_value).toBe(80);
    expect(report.metrics[0].actual_value).toBe(62);
    expect(report.metrics[0].deviation_percentage).toBe(-18);
    expect(report.metrics[0].improvement_priority).toBe("high");

    // 提案書作成率の乖離度が-12%（±15%以下）
    expect(report.metrics[1].name).toBe("proposal_creation_rate");
    expect(report.metrics[1].standard_value).toBe(70);
    expect(report.metrics[1].actual_value).toBe(58);
    expect(report.metrics[1].deviation_percentage).toBe(-12);
    expect(report.metrics[1].improvement_priority).toBe("medium");

    // 成約率の乖離度が-20%（±15%を超える）
    expect(report.metrics[2].name).toBe("contract_rate");
    expect(report.metrics[2].standard_value).toBe(50);
    expect(report.metrics[2].actual_value).toBe(30);
    expect(report.metrics[2].deviation_percentage).toBe(-20);
    expect(report.metrics[2].improvement_priority).toBe("high");

    // レポート全体の検証
    expect(report.high_priority_count).toBe(2);
    expect(report.generated_at).toBeDefined();
    expect(typeof report.generated_at).toBe("string");
  });
});