import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  generateRecommendationReport,
  RecommendationReportInput,
  RecommendationContent,
  ReportMetadata,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  let mockAIRecommendationEngine: any;
  let mockFileStorageAdapter: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("SCEN-308: 複数件の推奨内容が1つの統合PDFレポートに纏約される", async () => {
    // Arrange: AIRecommendationEngineのスタブ設定
    const recommendation_1: RecommendationContent = {
      id: "rec_001",
      customer_id: "cust_123",
      proposal_approach: "提案書パターンA",
      reasoning: "顧客の業種がIT系で、過去の成功事例と75%一致",
      relevance_score: 75,
      sequence: 1,
    };

    const recommendation_2: RecommendationContent = {
      id: "rec_002",
      customer_id: "cust_123",
      proposal_approach: "フォローメール戦略B",
      reasoning: "商談ステージが検討中で、最適タイミングは3日以内",
      relevance_score: 82,
      sequence: 2,
    };

    const recommendation_3: RecommendationContent = {
      id: "rec_003",
      customer_id: "cust_123",
      proposal_approach: "見積書カスタマイズパターンC",
      reasoning: "予算規模が500万以上で、複合提案が有効な事例が60%存在",
      relevance_score: 68,
      sequence: 3,
    };

    const recommendations: RecommendationContent[] = [
      recommendation_1,
      recommendation_2,
      recommendation_3,
    ];

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(
      recommendations
    );

    // FileStorageAdapterのスタブ設定
    const reportMetadata: ReportMetadata = {
      file_id: "file_xyz789",
      generated_at: "2024-01-20T10:30:00Z",
      file_size_bytes: 245678,
      format: "application/pdf",
      upload_count: 1,
    };

    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValue(
      reportMetadata
    );

    // 推奨内容レポート生成機能への入力
    const input: RecommendationReportInput = {
      customer_id: "cust_123",
      deal_id: "deal_456",
      include_reasoning: true,
      format: "pdf",
    };

    // Act: 推奨内容レポート生成機能を呼び出し
    const result = await generateRecommendationReport(
      input,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: 生成されたレポートがPDF形式で出力されることを確認
    expect(result.format).toBe("application/pdf");

    // Assert: 生成されたレポートファイル内に3件の推奨内容が統合された状態で存在することを確認
    expect(result.integrated_recommendations).toHaveLength(3);
    expect(result.integrated_recommendations[0].sequence).toBe(1);
    expect(result.integrated_recommendations[1].sequence).toBe(2);
    expect(result.integrated_recommendations[2].sequence).toBe(3);

    // Assert: 各推奨内容のセクションに提案アプローチ、根拠説明、適用可能性スコアが全て含まれていることを確認
    result.integrated_recommendations.forEach((rec: any) => {
      expect(rec).toHaveProperty("proposal_approach");
      expect(rec).toHaveProperty("reasoning");
      expect(rec).toHaveProperty("relevance_score");
      expect(typeof rec.proposal_approach).toBe("string");
      expect(typeof rec.reasoning).toBe("string");
      expect(typeof rec.relevance_score).toBe("number");
      expect(rec.relevance_score).toBeGreaterThanOrEqual(0);
      expect(rec.relevance_score).toBeLessThanOrEqual(100);
    });

    // Assert: FileStorageAdapterのuploadRecommendationReportメソッドが1回だけ呼び出されていることを確認
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenCalledTimes(1);

    // Assert: 渡された引数が統合されたレポート内容であることを確認
    const uploadCallArgs =
      mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCallArgs.recommendations_count).toBe(3);
    expect(uploadCallArgs.format).toBe("pdf");

    // Assert: レポートメタデータテーブルに1件のレコードが記録されていることを確認
    expect(result.metadata).toEqual(reportMetadata);
    expect(result.metadata.file_id).toBe("file_xyz789");
    expect(result.metadata.generated_at).toBe("2024-01-20T10:30:00Z");
    expect(result.metadata.file_size_bytes).toBe(245678);
    expect(result.metadata.upload_count).toBe(1);

    // Assert: 全体的なレポート構造の検証
    expect(result).toHaveProperty("file_id", "file_xyz789");
    expect(result).toHaveProperty("customer_id", "cust_123");
    expect(result).toHaveProperty("deal_id", "deal_456");
    expect(result).toHaveProperty("total_recommendations", 3);
    expect(result).toHaveProperty("aggregation_status", "success");
  });
});