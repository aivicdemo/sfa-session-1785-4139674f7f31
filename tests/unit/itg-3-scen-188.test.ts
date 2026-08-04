import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-188: [edge] 推奨内容キャッシュ管理機能 - AIエージェント呼び出し失敗時に過去推奨履歴から最新の1件が取得される
  test("AIRecommendationEngine呼び出し失敗時に推奨パターンマスタから最新1件のキャッシュ推奨を返却する", async () => {
    const customerId = "CUST-20250115-001";
    const dealCondition = {
      industry: "manufacturing",
      companySize: "large",
      budget: 5000000,
    };

    const pastRecommendations = [
      {
        id: "REC-20250113-001",
        customerId: "CUST-20250113-001",
        generatedAt: new Date("2025-01-13T09:00:00Z"),
        content: "提案アプローチA: コスト削減重視",
        reasoning: "過去事例から製造業大手へのコスト削減提案は成功率82%",
      },
      {
        id: "REC-20250114-001",
        customerId: "CUST-20250114-001",
        generatedAt: new Date("2025-01-14T15:20:00Z"),
        content: "提案アプローチB: 業務効率化重視",
        reasoning: "業務効率化ニーズは高まっている傾向",
      },
      {
        id: "REC-20250115-001",
        customerId: "CUST-20250115-001",
        generatedAt: new Date("2025-01-15T10:30:00Z"),
        content: "提案アプローチC: デジタル化支援",
        reasoning: "デジタル化投資予算確保の顧客が増加中",
      },
    ];

    const mockRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockRejectedValueOnce(new Error("API timeout"))
        .mockRejectedValueOnce(new Error("API timeout"))
        .mockRejectedValueOnce(new Error("API timeout")),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMasterData = pastRecommendations;

    const result = await generateRecommendationWithFallback(
      customerId,
      dealCondition,
      mockRecommendationEngine,
      mockPatternMasterData
    );

    expect(result.success).toBe(false);
    expect(result.fromCache).toBe(true);
    expect(result.userMessage).toMatch(/一時的な遅延/);
    expect(result.userMessage).toMatch(/過去の推奨履歴から類似案件を表示/);

    expect(result.recommendation).toStrictEqual({
      id: "REC-20250115-001",
      customerId: "CUST-20250115-001",
      generatedAt: new Date("2025-01-15T10:30:00Z"),
      content: "提案アプローチC: デジタル化支援",
      reasoning: "デジタル化投資予算確保の顧客が増加中",
    });

    expect(result.reasoningSummary).toBe("簡略版の根拠説明");

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
      3
    );

    const calls = mockRecommendationEngine.generateRecommendation.mock.calls;
    expect(calls.length).toBe(3);
  });
});