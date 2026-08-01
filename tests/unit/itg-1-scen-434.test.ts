import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { validateAlertThresholdConfig } from "../../src/logic/it-1-br-2-1-1-1";

fetchMock.enableMocks();

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-434
  test("アラート閾値が欠落している場合、エラーとして処理される", async () => {
    const alertConfigWithoutThreshold = {
      ruleId: "rule-001",
      ruleType: "inference_accuracy",
      name: "推論精度監視ルール",
      alertName: "推論精度低下アラート",
      enabled: true,
    };

    const expectedErrorResponse = {
      status: 400,
      errorCode: "ALERT_THRESHOLD_MISSING",
      errorMessage: "アラート閾値は必須項目です",
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        statusCode: 400,
        errorCode: "ALERT_THRESHOLD_MISSING",
        errorMessage: "アラート閾値は必須項目です",
      }),
      { status: 400 }
    );

    const response = await validateAlertThresholdConfig(
      alertConfigWithoutThreshold
    );

    expect(response.statusCode).toBe(expectedErrorResponse.status);
    expect(response.errorCode).toBe(expectedErrorResponse.errorCode);
    expect(response.errorMessage).toBe(expectedErrorResponse.errorMessage);

    const callArgs = fetchMock.mock.calls[0];
    expect(callArgs[1]?.method).toBe("POST");
  });
});