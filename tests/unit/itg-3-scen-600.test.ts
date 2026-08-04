import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨根拠の可視化機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-600
  test("OpenAI APIが失敗した場合にキャッシュされた過去推奨が代替表示される", async () => {
    const cachedRecommendations = [
      {
        id: "rec_001",
        customer_name: "テスト太郎",
        industry: "製造業",
        deal_amount: 5000000,
        recommendation_content: "生産効率化ソリューションの提案",
        reasoning: "顧客の生産ラインの自動化ニーズに対応",
        timestamp: "2024-01-10T10:00:00Z",
        confidence_score: 0.85,
      },
      {
        id: "rec_002",
        customer_name: "テスト太郎",
        industry: "製造業",
        deal_amount: 5000000,
        recommendation_content: "品質管理システムの導入提案",
        reasoning: "ISO対応による品質向上を支援",
        timestamp: "2024-01-05T14:30:00Z",
        confidence_score: 0.78,
      },
      {
        id: "rec_003",
        customer_name: "別社太郎",
        industry: "製造業",
        deal_amount: 3000000,
        recommendation_content: "在庫管理システム導入",
        reasoning: "供給チェーン最適化",
        timestamp: "2024-01-01T09:15:00Z",
        confidence_score: 0.72,
      },
      {
        id: "rec_004",
        customer_name: "営業花子",
        industry: "流通業",
        deal_amount: 2000000,
        recommendation_content: "POSシステム更新",
        reasoning: "小売業務のデジタル化",
        timestamp: "2023-12-28T16:45:00Z",
        confidence_score: 0.68,
      },
      {
        id: "rec_005",
        customer_name: "営業次郎",
        industry: "金融業",
        deal_amount: 10000000,
        recommendation_content: "コンプライアンス管理ツール",
        reasoning: "規制対応の自動化",
        timestamp: "2023-12-20T11:20:00Z",
        confidence_score: 0.82,
      },
    ];

    let apiCallCount = 0;
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        apiCallCount += 1;
        if (apiCallCount <= 3) {
          throw new Error("API connection error");
        }
        return null;
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input_case = {
      customer_name: "テスト太郎",
      industry: "製造業",
      deal_amount: 5000000,
      cached_recommendations: cachedRecommendations,
      ai_recommendation_engine: mockAIEngine,
      max_retries: 3,
      initial_retry_delay_ms: 1000,
    };

    const result = await visualizeRecommendationReasoning(input_case);

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.fallback_mode).toBe(true);
    expect(result.api_call_attempts).toBe(3);
    expect(result.substitute_recommendation).toBeDefined();
    expect(result.substitute_recommendation.id).toBe("rec_001");
    expect(result.substitute_recommendation.customer_name).toBe("テスト太郎");
    expect(result.substitute_recommendation.industry).toBe("製造業");
    expect(result.substitute_recommendation.deal_amount).toBe(5000000);
    expect(result.substitute_recommendation.recommendation_content).toBe(
      "生産効率化ソリューションの提案"
    );
    expect(result.reasoning_summary.length).toBeLessThanOrEqual(200);
    expect(result.reasoning_summary).toContain("生産ラインの自動化");
    expect(result.reasoning_summary).toContain("※推奨パターンマスタより生成");
    expect(result.confidence_score).toBeGreaterThanOrEqual(0.0);
    expect(result.confidence_score).toBeLessThanOrEqual(1.0);
    expect(result.confidence_score).toBe(0.85);
  });
});