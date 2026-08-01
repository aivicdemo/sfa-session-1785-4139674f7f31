import { analyzeEmployeeBehaviorPatterns } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-825
  test("成約実績と営業活動ログの紐付けができない場合（外部キー制約違反）、エラーを発生させる", () => {
    const sales_activity_log = [
      {
        employee_id: "EMP001",
        activity_datetime: "2024-01-15 10:30:00",
        activity_type: "訪問",
      },
    ];

    const contract_results = [
      {
        employee_id: "EMP999",
        contract_date: "2024-01-15",
        amount: 500000,
      },
    ];

    expect(() =>
      analyzeEmployeeBehaviorPatterns(sales_activity_log, contract_results)
    ).toThrow(/営業担当者ID/);
  });
});