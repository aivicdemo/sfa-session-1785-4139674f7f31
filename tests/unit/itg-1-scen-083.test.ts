import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  validateLearningDataForInference,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論実行前の学習データ量・品質検証機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-083
  test("学習データが最小要件を満たすが品質スコアが良好ライン直下の場合、推論実行が保留される", () => {
    const minimum_data_count = 1000;
    const quality_score = 79;
    const quality_threshold = 80;

    const result = validateLearningDataForInference({
      learning_data_count: minimum_data_count,
      quality_score: quality_score,
      quality_threshold: quality_threshold,
    });

    expect(result.status).toBe("Pending");
    expect(result.inference_allowed).toBe(false);
    expect(result.error_message).toMatch(/品質スコア/);
    expect(result.error_message).toMatch(/79/);
    expect(result.error_message).toMatch(/80/);
    expect(result.error_message).toMatch(/要件/);
    expect(result.inference_request_blocked).toBe(true);
  });
});