import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件へ推奨を自動生成する", () => {
  // SCEN-939
  test("同じ入力条件で2回推奨生成を実行した場合、AIエージェントは1回目のみ呼び出され、2回目は履歴からキャッシュ取得される", () => {
    const customerInfo = {
      industry: "IT",
      budget: 5000000,
      challenge: "業務効率化",
    };

    const dealCondition = {
      customerId: "CUST-001",
      stage: "initial_contact",
    };

    let engineCallCount = 0;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn((input: unknown) => {
        engineCallCount++;
        return {
          approach: "クラウド導入",
          confidenceScore: 0.92,
          reasoning: "クラウドソリューションにより業務効率化が期待できる事例が3件確認されました",
          generatedAt: new Date("2024-01-15T10:00:00Z").toISOString(),
        };
      }),
    };

    const firstResult = generateRecommendation(
      customerInfo,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(firstResult).toEqual({
      approach: "クラウド導入",
      confidenceScore: 0.92,
      reasoning: "クラウドソリューションにより業務効率化が期待できる事例が3件確認されました",
      generatedAt: "2024-01-15T10:00:00Z",
    });

    expect(engineCallCount).toBe(1);

    const secondResult = generateRecommendation(
      customerInfo,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(secondResult).toEqual({
      approach: "クラウド導入",
      confidenceScore: 0.92,
      reasoning: "クラウドソリューションにより業務効率化が期待できる事例が3件確認されました",
      generatedAt: "2024-01-15T10:00:00Z",
    });

    expect(engineCallCount).toBe(1);
  });
});