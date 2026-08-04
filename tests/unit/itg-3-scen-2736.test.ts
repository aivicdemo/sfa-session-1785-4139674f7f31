import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2736: OpenAI API呼び出しがタイムアウトしたとき指数バックオフで最大3回再試行される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const callTimings: number[] = [];
    const startTime = Date.now();

    mockAIEngine.generateRecommendation.mockImplementation(async () => {
      const currentTime = Date.now();
      callTimings.push(currentTime - startTime);

      const callCount = callTimings.length;

      if (callCount === 1 || callCount === 2) {
        // 1回目と2回目はタイムアウト
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("API timeout"));
          }, 31000);
        });
      } else if (callCount === 3) {
        // 3回目は成功
        return Promise.resolve({
          recommendedApproach: "提案アプローチ_顧客属性_営業段階_成功パターン",
          successPatternId: "SP-2024-0015",
          confidenceScore: 87,
          reasoning: [
            "過去5件の類似案件で成約率82%を記録",
            "顧客業種_製造業での同一提案アプローチ採用率76%",
            "商談段階_ニーズ確認後の提案タイミング一致度92%",
          ],
        });
      }

      throw new Error("Unexpected call count");
    });

    const newDealData = {
      customerId: "CUST-20240115-001",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealStage: "ニーズ確認",
      dealAmount: 5000000,
      dealTimeline: "Q1実行予定",
      currentChallenges: ["業務効率化", "コスト削減"],
    };

    const result = await generateRecommendation(newDealData, mockAIEngine);

    expect(result.recommendedApproach).toBe(
      "提案アプローチ_顧客属性_営業段階_成功パターン"
    );
    expect(result.successPatternId).toBe("SP-2024-0015");
    expect(result.confidenceScore).toBe(87);
    expect(result.reasoning).toEqual([
      "過去5件の類似案件で成約率82%を記録",
      "顧客業種_製造業での同一提案アプローチ採用率76%",
      "商談段階_ニーズ確認後の提案タイミング一致度92%",
    ]);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    expect(callTimings.length).toBe(3);

    const timingBetweenCall1And2 = callTimings[1] - callTimings[0];
    const timingBetweenCall2And3 = callTimings[2] - callTimings[1];

    expect(timingBetweenCall1And2).toBeGreaterThanOrEqual(1000);
    expect(timingBetweenCall1And2).toBeLessThan(1500);

    expect(timingBetweenCall2And3).toBeGreaterThanOrEqual(2000);
    expect(timingBetweenCall2And3).toBeLessThan(2500);
  });
});