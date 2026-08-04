import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeCustomerContactSequence } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2206
  test("顧客対応の接触パターンの分析 - 成功パターンとの順序比較により乖離度が算出される", () => {
    const successPatternSequence = ["接触1", "接触2", "接触3"];
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          {
            contactSequence: successPatternSequence,
            successRate: 0.85,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const test_case_1_actual_sequence = ["接触1", "接触2", "接触3"];
    const test_case_1_expected_divergence = 0.0;

    const test_case_2_actual_sequence = ["接触1", "接触3", "接触2"];
    const test_case_2_expected_divergence = 0.67;

    const result_case_1 = analyzeCustomerContactSequence(
      {
        customerId: "CUST-001",
        actualContactSequence: test_case_1_actual_sequence,
        successPatternSequence: successPatternSequence,
      },
      mockAIEngine
    );

    expect(result_case_1).toEqual({
      divergenceScore: test_case_1_expected_divergence,
      matchesSuccessPattern: true,
      sequenceAnalysis: {
        expectedSequence: successPatternSequence,
        actualSequence: test_case_1_actual_sequence,
        isSequenceCorrect: true,
      },
    });

    const result_case_2 = analyzeCustomerContactSequence(
      {
        customerId: "CUST-001",
        actualContactSequence: test_case_2_actual_sequence,
        successPatternSequence: successPatternSequence,
      },
      mockAIEngine
    );

    expect(result_case_2).toEqual({
      divergenceScore: test_case_2_expected_divergence,
      matchesSuccessPattern: false,
      sequenceAnalysis: {
        expectedSequence: successPatternSequence,
        actualSequence: test_case_2_actual_sequence,
        isSequenceCorrect: false,
      },
    });

    expect(result_case_2.divergenceScore).toBeGreaterThan(0);
    expect(typeof result_case_2.divergenceScore).toBe("number");
  });
});