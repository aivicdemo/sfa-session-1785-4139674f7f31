import { approveModificationRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-569: 修正ルール承認判定機能 - 修正ルール案が妥当性を満たす場合、承認決定が実行される", () => {
    // テストデータ: 過去の承認事例データベース（成功した修正ルール10件）
    const past_successful_rules = [
      {
        rule_id: "RULE_001",
        target_data_type: "customer_name",
        rule_content: "(株)を(株式会社)に統一",
        approval_status: "approved",
        approved_date: "2024-01-10T09:30:00Z",
        risk_level: "low",
        match_score: 0.95,
      },
      {
        rule_id: "RULE_002",
        target_data_type: "customer_name",
        rule_content: "㈱を(株式会社)に統一",
        approval_status: "approved",
        approved_date: "2024-01-12T14:15:00Z",
        risk_level: "low",
        match_score: 0.93,
      },
      {
        rule_id: "RULE_003",
        target_data_type: "customer_name",
        rule_content: "(有)を(有限会社)に統一",
        approval_status: "approved",
        approved_date: "2024-01-15T10:00:00Z",
        risk_level: "low",
        match_score: 0.91,
      },
      {
        rule_id: "RULE_004",
        target_data_type: "customer_name",
        rule_content: "LLC to Limited Liability Company",
        approval_status: "approved",
        approved_date: "2024-01-18T11:45:00Z",
        risk_level: "low",
        match_score: 0.89,
      },
      {
        rule_id: "RULE_005",
        target_data_type: "phone_number",
        rule_content: "ハイフン統一 (03-1234-5678形式)",
        approval_status: "approved",
        approved_date: "2024-01-20T09:20:00Z",
        risk_level: "low",
        match_score: 0.88,
      },
      {
        rule_id: "RULE_006",
        target_data_type: "address",
        rule_content: "都道府県コード正規化",
        approval_status: "approved",
        approved_date: "2024-01-22T15:30:00Z",
        risk_level: "low",
        match_score: 0.90,
      },
      {
        rule_id: "RULE_007",
        target_data_type: "customer_name",
        rule_content: "全角スペースを全角へ統一",
        approval_status: "approved",
        approved_date: "2024-01-25T08:45:00Z",
        risk_level: "low",
        match_score: 0.87,
      },
      {
        rule_id: "RULE_008",
        target_data_type: "email",
        rule_content: "メールアドレス小文字統一",
        approval_status: "approved",
        approved_date: "2024-02-01T13:15:00Z",
        risk_level: "low",
        match_score: 0.92,
      },
      {
        rule_id: "RULE_009",
        target_data_type: "customer_name",
        rule_content: "Inc to Incorporated",
        approval_status: "approved",
        approved_date: "2024-02-05T10:30:00Z",
        risk_level: "low",
        match_score: 0.86,
      },
      {
        rule_id: "RULE_010",
        target_data_type: "postal_code",
        rule_content: "郵便番号ハイフン統一",
        approval_status: "approved",
        approved_date: "2024-02-08T14:00:00Z",
        risk_level: "low",
        match_score: 0.94,
      },
    ];

    // テストデータ: 現在有効なルール基準
    const current_rule_criteria = {
      priority_threshold: 1,
      risk_level_acceptable: ["low", "medium"],
      applicable_scope: ["all_branches"],
      minimum_match_score: 0.80,
      approval_threshold_score: 0.85,
    };

    // 修正ルール案の作成
    const modification_rule_proposal = {
      target_data_type: "customer_name",
      rule_content: "(株)と㈱を株式会社に統一",
      applicable_scope: "all_branches",
      risk_evaluation: "low",
      rule_priority: 1,
      proposer_id: "USER_001",
      proposal_date: "2024-02-15T09:00:00Z",
    };

    // AIエージェントに修正ルール案を投入し、妥当性判定処理を実行
    const approval_result = approveModificationRule({
      modification_rule_proposal: modification_rule_proposal,
      past_successful_rules: past_successful_rules,
      current_rule_criteria: current_rule_criteria,
      approver_id: "APPROVER_001",
      approval_timestamp: "2024-02-15T11:30:00Z",
    });

    // 承認判定結果と判定根拠をシステムが返却
    expect(approval_result.approval_status).toBe("approved");
    expect(approval_result.rule_status_transition.from_status).toBe("unapproved");
    expect(approval_result.rule_status_transition.to_status).toBe("approved");
    expect(approval_result.rule_status_transition.transition_timestamp).toBe(
      "2024-02-15T11:30:00Z"
    );

    // 妥当性判定スコアと類似過去事例マッチ数を検証
    expect(approval_result.validity_judgment_score).toBe(0.92);
    expect(approval_result.similar_past_case_match_count).toBe(7);

    // システムログに記録されたエントリを検証
    expect(approval_result.system_log_entry.rule_id).toBeDefined();
    expect(approval_result.system_log_entry.approval_date_time).toBe(
      "2024-02-15T11:30:00Z"
    );
    expect(approval_result.system_log_entry.approver_id).toBe("APPROVER_001");
    expect(approval_result.system_log_entry.validity_judgment_score).toBe(0.92);
    expect(approval_result.system_log_entry.similar_past_case_match_count).toBe(
      7
    );

    // 修正ルールが有効ルール一覧に追加されたことを検証
    expect(approval_result.added_to_active_rules_list).toBe(true);
    expect(approval_result.accessible_by_data_modification_engine).toBe(true);

    // 承認決定の実行処理が完了し、修正ルール情報が保存されていることを検証
    expect(approval_result.execution_status).toBe("completed");
    expect(approval_result.modification_rule_record_saved).toBe(true);
  });
});