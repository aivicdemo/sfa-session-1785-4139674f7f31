import { describe, test, expect, beforeEach } from "@jest/globals";
import { analyzeEmployeeBehaviorPattern } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-476
  test("営業活動ログの営業担当者IDと指定営業担当者IDが一致しない場合、エラーを返す", () => {
    const activity_logs = [
      {
        activity_log_id: "LOG001",
        employee_id: "EMP001",
        customer_id: "CUST001",
        activity_date: "2024-01-15",
        activity_type: "visit",
        notes: "初回訪問",
      },
      {
        activity_log_id: "LOG002",
        employee_id: "EMP001",
        customer_id: "CUST002",
        activity_date: "2024-01-16",
        activity_type: "call",
        notes: "フォローアップ電話",
      },
      {
        activity_log_id: "LOG003",
        employee_id: "EMP001",
        customer_id: "CUST003",
        activity_date: "2024-01-17",
        activity_type: "email",
        notes: "提案資料送付",
      },
      {
        activity_log_id: "LOG004",
        employee_id: "EMP001",
        customer_id: "CUST001",
        activity_date: "2024-01-18",
        activity_type: "visit",
        notes: "提案プレゼン",
      },
      {
        activity_log_id: "LOG005",
        employee_id: "EMP001",
        customer_id: "CUST002",
        activity_date: "2024-01-19",
        activity_type: "call",
        notes: "契約条件確認",
      },
    ];

    const target_employee_id = "EMP002";

    expect(() =>
      analyzeEmployeeBehaviorPattern(activity_logs, target_employee_id)
    ).toThrow(/営業活動ログの営業担当者ID.*と指定営業担当者ID.*が一致しません/);
  });
});