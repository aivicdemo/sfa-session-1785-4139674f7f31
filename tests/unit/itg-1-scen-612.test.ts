import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeProposalPatterns } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-612
  test("提案内容データが欠落しているときエラーになる", () => {
    const incompleteProposalRecord = {
      sales_activity_id: "SA-20240115-001",
      sales_rep_id: "REP-0001",
      customer_id: "CUST-0042",
      proposal_content: "顧客の経営課題に対するソリューション提案",
      // 提案日時フィールドを意図的に削除
      follow_up_interval_days: 7,
      contact_frequency: 3,
      success_pattern_match_rate: 0.85,
    };

    expect(() => analyzeProposalPatterns(incompleteProposalRecord as any)).toThrow(
      /提案日時/
    );
  });
});