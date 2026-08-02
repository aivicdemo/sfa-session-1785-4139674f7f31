import {
  calculateProcessComplianceScoreWithPrioritization,
} from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-299
  test("標準プロセス遵守度スコア計算 - スコアが同値である複数営業担当者のとき、優先順位付与の後続順序が定義通りになる", () => {
    const salesPersons = [
      {
        sales_person_id: "SP001",
        sales_person_name: "営業担当者A",
        registration_date: new Date("2024-01-10T09:00:00Z"),
        compliance_score: 85,
        process_steps_completed: 3,
        process_steps_total: 4,
        deviation_pattern: "normal",
      },
      {
        sales_person_id: "SP002",
        sales_person_name: "営業担当者B",
        registration_date: new Date("2024-01-15T10:30:00Z"),
        compliance_score: 85,
        process_steps_completed: 3,
        process_steps_total: 4,
        deviation_pattern: "normal",
      },
      {
        sales_person_id: "SP003",
        sales_person_name: "営業担当者C",
        registration_date: new Date("2024-01-20T14:00:00Z"),
        compliance_score: 85,
        process_steps_completed: 3,
        process_steps_total: 4,
        deviation_pattern: "normal",
      },
    ];

    const result =
      calculateProcessComplianceScoreWithPrioritization(salesPersons);

    expect(result).toHaveLength(3);
    expect(result[0].sales_person_id).toBe("SP001");
    expect(result[0].sales_person_name).toBe("営業担当者A");
    expect(result[0].priority_rank).toBe(1);
    expect(result[1].sales_person_id).toBe("SP002");
    expect(result[1].sales_person_name).toBe("営業担当者B");
    expect(result[1].priority_rank).toBe(2);
    expect(result[2].sales_person_id).toBe("SP003");
    expect(result[2].sales_person_name).toBe("営業担当者C");
    expect(result[2].priority_rank).toBe(3);
  });
});