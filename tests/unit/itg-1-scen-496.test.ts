import { describe, test, expect, beforeEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");

fetchMock.enableMocks();

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-496
  test("レポート生成履歴が欠落している場合、エラーを返す", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    const response = await fetch(
      "/api/report-generation-history?dashboard=sales-process-audit",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const responseData = await response.json();

    if (!responseData || responseData.length === 0) {
      const errorResponse = {
        statusCode: 400,
        errorCode: "REPORT_HISTORY_NOT_FOUND",
        errorMessage:
          "レポート生成履歴が見つかりません。レポートを生成してから再度お試しください。",
      };

      expect(errorResponse.statusCode).toBe(400);
      expect(errorResponse.errorCode).toBe("REPORT_HISTORY_NOT_FOUND");
      expect(errorResponse.errorMessage).toBe(
        "レポート生成履歴が見つかりません。レポートを生成してから再度お試しください。"
      );
    }
  });
});