import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { classifyAndPrioritizeDetectedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-792: [error] 問題検出結果の分類・優先度付け機能 - 営業担当者IDが空文字列の場合、エラーになる
  test("営業担当者IDが空文字列の場合、INVALID_SALES_PERSON_IDエラーを返す", () => {
    const invalid_sales_person_id = "";
    const detected_issues = [
      {
        issue_id: "issue_001",
        issue_type: "提案内容_標準プロセス乖離",
        detected_at: new Date("2024-01-15T10:30:00Z"),
        severity: "high",
        impact_description: "標準プロセスステップ2からの乖離が30%以上",
      },
    ];
    const detection_timestamp = new Date("2024-01-15T10:30:00Z");
    const process_definition_id = "process_def_001";

    expect(() =>
      classifyAndPrioritizeDetectedIssues({
        sales_person_id: invalid_sales_person_id,
        detected_issues: detected_issues,
        detection_timestamp: detection_timestamp,
        process_definition_id: process_definition_id,
      })
    ).toThrow(/営業担当者ID/);
  });
});