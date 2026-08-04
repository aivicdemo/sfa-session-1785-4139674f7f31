import { describe, test, expect, beforeEach, jest } from "@jest/globals";

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("成功パターン抽出・推奨機能 - 指数バックオフ再試行", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  // SCEN-671
  test("OpenAI API呼び出しが1回目のみ失敗した場合、最大3回の指数バックオフ再試行後に推奨を返す", async () => {
    const { generateRecommendation } = await import(
      "../../src/logic/it-1-br-3-3-2-1"
    );

    const successRecommendation = {
      patternId: "PAT-001",
      approach: "顧客課題別アプローチ",
      confidence: 0.92,
      reasoning: "過去成功事例と78%一致",
    };

    const newCaseData = {
      customerId: "CUST-123",
      industry: "製造",
      budget: "500万円",
    };

    mockFetch.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("API Error 500"));
          }, 0);
        })
    );

    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Response(JSON.stringify(successRecommendation), {
                status: 200,
              })
            );
          }, 1000);
        })
    );

    const resultPromise = generateRecommendation(newCaseData);

    // Fast-forward past the first attempt and first retry delay (1 second)
    await jest.advanceTimersByTimeAsync(1000);

    const result = await resultPromise;

    expect(result).toEqual(successRecommendation);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});