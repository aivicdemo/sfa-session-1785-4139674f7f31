import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

const fetchMock = require("jest-fetch-mock");

describe("AI推奨エンジン呼び出し - OpenAI API 5xx エラーとフェイルオーバー", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-1106
  test("[error] OpenAI API が 5xx エラーを返却したとき、代替パターンマスタからの推奨返却に切り替わる", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockPatternMaster = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "PAT-2025-0001",
          recommendedApproach: "初回接触向けニーズ確定提案",
          applicableConditions: {
            industry: "SaaS",
            budgetMinimum: 10000000,
            dealPhase: "initial_contact",
          },
          successRate: 0.78,
        },
      ]),
    };

    let callCount = 0;
    mockAIEngine.generateRecommendation.mockImplementation(async () => {
      callCount += 1;
      if (callCount < 3) {
        const delay = callCount === 1 ? 1000 : 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw {
        status: 503,
        message: "Service Unavailable",
      };
    });

    const customerInfo = {
      customerId: "CUST-2025-001",
      industry: "SaaS",
      budgetRange: "1000万円以上",
    };

    const dealConditions = {
      dealPhase: "initial_contact",
      needsStatus: "undefined",
    };

    let result: {
      patternId: string;
      recommendedApproach: string;
      applicableConditions: {
        industry: string;
        budgetMinimum: number;
        dealPhase: string;
      };
      userMessage: string;
      reasoningExplanation: string;
      isUsingFallback: boolean;
    };

    try {
      result = await generateRecommendation(
        customerInfo,
        dealConditions,
        mockAIEngine,
        mockPatternMaster
      );
    } catch (error) {
      throw error;
    }

    expect(callCount).toBe(3);
    expect(mockPatternMaster.getTopSuccessPatterns).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.patternId).toBe("PAT-2025-0001");
    expect(result.recommendedApproach).toBe("初回接触向けニーズ確定提案");
    expect(result.applicableConditions).toEqual({
      industry: "SaaS",
      budgetMinimum: 10000000,
      dealPhase: "initial_contact",
    });
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.reasoningExplanation).toBeTruthy();
    expect(result.reasoningExplanation).not.toContain("generateRecommendationReasoning");
    expect(result.isUsingFallback).toBe(true);
  });
});