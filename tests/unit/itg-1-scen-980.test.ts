import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { evaluateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

fetchMock.enableMocks();

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-980
  test("成功要因・失敗要因の抽出と承認判定機能 - 承認基準サービス外部障害時のエラーハンドリング", async () => {
    const extracted_factors = {
      success_factors: ["顧客ニーズ把握"],
      failure_factors: ["提案タイミング遅延"],
    };

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 503 });

    try {
      await evaluateApprovalCriteria(extracted_factors);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toMatchObject({
        errorCode: "APPROVAL_SERVICE_UNAVAILABLE",
        message: "承認基準サービスに接続できません",
        statusCode: 503,
      });
      expect((error as any).timestamp).toBeDefined();
      expect((error as any).timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
    }
  });
});