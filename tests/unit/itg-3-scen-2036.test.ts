import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2036: 経営層向け説得資料の自動生成機能 - 照合評価結果の改善提案リストに同値が並ぶとき、並び順は維持されて資料に記載される", async () => {
    // テスト対象の照合評価結果データセット準備
    // 同一スコア値を持つ改善提案3件を順序付きで配列に格納
    const improvementProposals = [
      {
        proposal_id: "prop_001",
        proposal_name: "顧客接触頻度の最適化",
        score: 85,
        order: 1,
      },
      {
        proposal_id: "prop_002",
        proposal_name: "提案内容のパーソナライズ化",
        score: 85,
        order: 2,
      },
      {
        proposal_id: "prop_003",
        proposal_name: "契約条件の柔軟性向上",
        score: 85,
        order: 3,
      },
    ];

    const customerInfo = {
      customer_id: "cust_001",
      customer_name: "テスト顧客",
      industry: "情報通信業",
      revenue: 5000000000,
    };

    const dealInfo = {
      deal_id: "deal_001",
      product_line: "エンタープライズソリューション",
      deal_amount: 10000000,
      expected_close_date: "2026-12-31",
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "rec_001",
        customer_id: "cust_001",
        deal_id: "deal_001",
        improvement_proposals: improvementProposals,
        confidence_score: 92,
        recommendation_timestamp: "2026-08-01T08:30:00Z",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // FileStorageAdapterのスタブ設定
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          file_key: "reports/rec_001_executive_brief.pdf",
          file_url: "https://storage.example.com/reports/rec_001_executive_brief.pdf",
          upload_timestamp: "2026-08-01T08:31:00Z",
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 経営層向け説得資料自動生成機能を実行
    const generatedReport = await generateRecommendation(
      customerInfo,
      dealInfo,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // 生成されたPDF資料の内容を検証
    expect(generatedReport).toBeDefined();
    expect(generatedReport.file_key).toBe(
      "reports/rec_001_executive_brief.pdf"
    );

    // 生成時に呼び出されたAIRecommendationEngine.generateRecommendationを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();

    // mockから返却されたrecommendationデータを取得
    const callArgs = mockAIRecommendationEngine.generateRecommendation.mock
      .results[0].value;
    const returnedProposals = (await callArgs).improvement_proposals;

    // 改善提案の並び順を検証
    // 入力配列の順序が保持されていることを確認
    expect(returnedProposals[0].proposal_name).toBe("顧客接触頻度の最適化");
    expect(returnedProposals[0].score).toBe(85);
    expect(returnedProposals[0].order).toBe(1);

    expect(returnedProposals[1].proposal_name).toBe(
      "提案内容のパーソナライズ化"
    );
    expect(returnedProposals[1].score).toBe(85);
    expect(returnedProposals[1].order).toBe(2);

    expect(returnedProposals[2].proposal_name).toBe("契約条件の柔軟性向上");
    expect(returnedProposals[2].score).toBe(85);
    expect(returnedProposals[2].order).toBe(3);

    // FileStorageAdapterの呼び出しを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 返却されたファイルメタデータを確認
    expect(generatedReport.upload_timestamp).toBe("2026-08-01T08:31:00Z");
  });
});