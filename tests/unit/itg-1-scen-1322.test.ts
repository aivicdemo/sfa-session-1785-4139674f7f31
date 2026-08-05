import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx12Imp1Agent } from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1322
  test("権限外ユーザーのデータ参照とツール操作が拒否される", async () => {
    const unauthorized_user_id = "USR-GENERAL-001";
    const unauthorized_user_role = "営業一般社員";
    const trigger_event = "月次営業会議";
    const target_month = "2024-01";
    const auth_error_code = "AUTH_INSUFFICIENT_PRIVILEGE";

    const session_context = {
      user_id: unauthorized_user_id,
      user_role: unauthorized_user_role,
      auth_token: "invalid_token_xyz",
      session_id: "sess_unauthorized_001",
    };

    const request_payload = {
      trigger: trigger_event,
      analysis_month: target_month,
      session: session_context,
    };

    let auth_check_audit_events: Array<{
      timestamp: string;
      user_id: string;
      action: string;
      result: string;
      error_code: string;
    }> = [];

    const mock_ai_client = {
      checkAuthorizationForDataAccess: jest
        .fn()
        .mockImplementation((userId: string, requiredRole: string) => {
          auth_check_audit_events.push({
            timestamp: "2024-01-15T10:00:00Z",
            user_id: userId,
            action: "営業データベースアクセス権限チェック",
            result: "拒否",
            error_code: auth_error_code,
          });
          throw new Error("営業管理者権限が必要です");
        }),

      checkAuthorizationForProcessReference: jest
        .fn()
        .mockImplementation((userId: string) => {
          auth_check_audit_events.push({
            timestamp: "2024-01-15T10:00:01Z",
            user_id: userId,
            action: "営業プロセス標準書参照権限チェック",
            result: "拒否",
            error_code: auth_error_code,
          });
          throw new Error("営業管理者権限が必要です");
        }),

      checkAuthorizationForIndividualAnalysis: jest
        .fn()
        .mockImplementation((userId: string) => {
          auth_check_audit_events.push({
            timestamp: "2024-01-15T10:00:02Z",
            user_id: userId,
            action: "個人成約率分析データ参照権限チェック",
            result: "拒否",
            error_code: auth_error_code,
          });
          throw new Error("営業管理者権限が必要です");
        }),

      extractSalesData: jest.fn().mockImplementation(() => {
        throw new Error("このツール操作は実行されるべきではありません");
      }),

      executeDataQualityCheck: jest.fn().mockImplementation(() => {
        throw new Error("このツール操作は実行されるべきではありません");
      }),

      executeDeviationAnalysis: jest.fn().mockImplementation(() => {
        throw new Error("このツール操作は実行されるべきではありません");
      }),
    };

    let error_thrown: Error | null = null;
    let error_message: string | null = null;

    try {
      await runTx12Imp1Agent(request_payload, mock_ai_client);
    } catch (err) {
      error_thrown = err as Error;
      error_message = (err as Error).message;
    }

    expect(error_thrown).not.toBeNull();
    expect(error_message).toMatch(/営業管理者権限が必要です/);

    expect(mock_ai_client.checkAuthorizationForDataAccess).toHaveBeenCalledWith(
      unauthorized_user_id,
      "営業管理者"
    );

    expect(mock_ai_client.extractSalesData).not.toHaveBeenCalled();
    expect(mock_ai_client.executeDataQualityCheck).not.toHaveBeenCalled();
    expect(mock_ai_client.executeDeviationAnalysis).not.toHaveBeenCalled();

    expect(auth_check_audit_events.length).toBeGreaterThan(0);

    const first_audit_event = auth_check_audit_events[0];
    expect(first_audit_event.user_id).toBe(unauthorized_user_id);
    expect(first_audit_event.result).toBe("拒否");
    expect(first_audit_event.error_code).toBe(auth_error_code);
    expect(first_audit_event.timestamp).toBe("2024-01-15T10:00:00Z");

    const audit_action_names = auth_check_audit_events.map(
      (event) => event.action
    );
    expect(audit_action_names).toContain("営業データベースアクセス権限チェック");
  });
});