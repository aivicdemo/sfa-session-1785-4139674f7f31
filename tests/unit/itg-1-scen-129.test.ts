import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  validateDataQualityBeforeInference,
  DataQualityValidationRequest,
  DataQualityValidationResponse,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論実行前データ品質検証機能", () => {
  let mockRequest: DataQualityValidationRequest;

  beforeEach(() => {
    mockRequest = {
      agentId: "agent-001",
      dataQualityScore: null,
      targetDatasetId: "dataset-sales-process-2024-01",
      executionTimestamp: "2024-01-15T10:00:00Z",
    };
  });

  // SCEN-129
  test("データ品質スコアが空（null）のとき推論実行が保留される", () => {
    const response: DataQualityValidationResponse =
      validateDataQualityBeforeInference(mockRequest);

    expect(response.status).toBe("PENDING_VALIDATION");
    expect(response.inferenceExecutionAllowed).toBe(false);
    expect(response.errorMessage).toBe(
      "Data quality score is null. Inference execution suspended until quality validation is completed."
    );
    expect(response.logEntry).toContain(
      "Data quality score is null. Inference execution suspended until quality validation is completed."
    );
  });
});