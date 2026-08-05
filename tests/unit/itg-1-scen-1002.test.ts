import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { evaluateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  let originalDateNow: () => number;

  beforeEach(() => {
    originalDateNow = Date.now;
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  test("SCEN-1002: 月末日の承認申請が有効として判定され、翌月以降も有効性を保つ", () => {
    // Setup: 月末日（2024年1月31日）を現在日時として設定
    const monthEndDate = new Date("2024-01-31T23:59:59Z");
    Date.now = () => monthEndDate.getTime();

    // 成功要因・失敗要因の抽出データを準備
    const extractionData = {
      extraction_id: "extract_2024_01",
      extraction_period_start: "2024-01-01",
      extraction_period_end: "2024-01-31",
      success_factors: [
        {
          factor_id: "sf_001",
          factor_name: "初回接触から3営業日以内の提案実行",
          occurrence_count: 12,
          success_count: 10,
        },
        {
          factor_id: "sf_002",
          factor_name: "顧客課題事前調査の実施",
          occurrence_count: 8,
          success_count: 8,
        },
      ],
      failure_factors: [
        {
          factor_id: "ff_001",
          factor_name: "提案資料なしでの初回面談",
          occurrence_count: 5,
          failure_count: 5,
        },
        {
          factor_id: "ff_002",
          factor_name: "顧客反応後1週間以上フォローアップなし",
          occurrence_count: 7,
          failure_count: 6,
        },
      ],
    };

    // 承認申請パラメータ
    const approvalRequest = {
      request_id: "appr_req_2024_01_31",
      extraction_id: extractionData.extraction_id,
      requested_at: "2024-01-31T23:59:59Z",
      requested_by_user_id: "user_dept_head_001",
      request_period_month: "2024-01",
      target_month: "202401",
    };

    // 承認基準
    const approvalCriteria = {
      min_success_factor_count: 2,
      min_failure_factor_count: 1,
      min_success_occurrence_count: 6,
      min_failure_occurrence_count: 4,
      success_rate_threshold: 0.65,
      approval_validity_period_days: 30,
    };

    // 承認申請を実行
    const approvalResult = evaluateApprovalCriteria({
      extraction_data: extractionData,
      approval_request: approvalRequest,
      approval_criteria: approvalCriteria,
    });

    // 月末日の承認申請は「有効」として判定される
    expect(approvalResult.is_valid).toBe(true);

    // 承認ステータスが「承認済み」
    expect(approvalResult.approval_status).toBe("APPROVED");

    // 承認有効期限が当月末日を含む期間として記録される
    const approvalValidityStart = new Date(approvalResult.approval_validity_start);
    const approvalValidityEnd = new Date(approvalResult.approval_validity_end);
    const monthEndDateObj = new Date("2024-01-31");

    expect(approvalValidityStart.getTime()).toBeLessThanOrEqual(
      monthEndDateObj.getTime()
    );
    expect(approvalValidityEnd.getTime()).toBeGreaterThanOrEqual(
      monthEndDateObj.getTime()
    );

    // 監査ログに承認日時が月末日として記録されている
    expect(approvalResult.audit_log.approval_executed_at).toBe(
      "2024-01-31T23:59:59Z"
    );
    expect(approvalResult.audit_log.approval_month).toBe("202401");

    // 翌月以降の日付に日時を変更してから承認有効性を確認
    const nextMonthDate = new Date("2024-02-15T10:00:00Z");
    Date.now = () => nextMonthDate.getTime();

    // 有効期限内であるため、当月の承認申請の有効性が失われない
    expect(nextMonthDate.getTime()).toBeLessThanOrEqual(
      approvalValidityEnd.getTime()
    );
    expect(approvalResult.approval_status).toBe("APPROVED");

    // 監査ログの承認日時は月末日のまま
    expect(approvalResult.audit_log.approval_executed_at).toBe(
      "2024-01-31T23:59:59Z"
    );
  });
});