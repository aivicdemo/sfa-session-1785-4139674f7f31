import { determineApplicableApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-254
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 業種が完全に一致する場合、そのアプローチが適用可能と判定される", () => {
    const success_pattern_matrix = [
      {
        industry: "製造業",
        approach: "リード獲得型営業",
        applicable: true,
      },
      {
        industry: "小売業",
        approach: "ソリューション営業",
        applicable: true,
      },
    ];

    const customer_data = {
      customer_id: "CUST001",
      industry: "製造業",
      company_name: "ABC Manufacturing Co.",
    };

    const result = determineApplicableApproach(
      customer_data,
      success_pattern_matrix
    );

    expect(result.applicable).toBe(true);
    expect(result.approach).toBe("リード獲得型営業");
    expect(result.industry_match).toBe("製造業");
  });
});