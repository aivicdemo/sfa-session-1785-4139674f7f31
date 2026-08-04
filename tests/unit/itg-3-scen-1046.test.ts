import { recordRecommendationBasis } from "../../src/logic/it-1-br-3-1-1-1";

describe("推奨根拠の記録処理 - 複数項目の優先度順記録", () => {
  // SCEN-1046
  test("推奨根拠が複数項目の場合、全項目が優先度順に記録される", () => {
    // Arrange: モック化されたAIRecommendationEngineの推奨結果を構成
    const mockRecommendationResult = {
      recommendationId: "rec_20240115_001",
      dealId: "deal_20240115_0042",
      customerId: "cust_M001",
      generatedAt: new Date("2024-01-15T11:00:00Z"),
      basis: [
        {
          order: 1,
          relevanceScore: 0.95,
          description:
            "顧客業界が製造業で、過去成功事例の70%が同業界",
          evidence: ["industry_match", "historical_success_rate_70pct"],
        },
        {
          order: 2,
          relevanceScore: 0.85,
          description:
            "予算規模が500万円～1000万円帯で、過去成功パターンと合致",
          evidence: ["budget_range_5M_10M", "pattern_match"],
        },
        {
          order: 3,
          relevanceScore: 0.72,
          description:
            "導入期間が3ヶ月以内という急ぎニーズで、類似案件の成約率が68%",
          evidence: ["implementation_period_3months", "similar_deal_close_rate_68pct"],
        },
      ],
    };

    // Act: recordRecommendationBasisメソッドを呼び出し
    const recordResult = recordRecommendationBasis(mockRecommendationResult);

    // Assert: 記録されたレコードの検証
    expect(recordResult).toBeDefined();
    expect(recordResult.recordedCount).toBe(3);

    // 記録されたレコードの順序と内容を検証
    expect(recordResult.records).toHaveLength(3);

    // 第1位の根拠（relevanceScore: 0.95）
    expect(recordResult.records[0]).toEqual({
      recommendationBasisId: expect.any(String),
      recommendationId: "rec_20240115_001",
      dealId: "deal_20240115_0042",
      customerId: "cust_M001",
      priority: 1,
      relevanceScore: 0.95,
      description:
        "顧客業界が製造業で、過去成功事例の70%が同業界",
      evidence: ["industry_match", "historical_success_rate_70pct"],
      recordedTimestamp: expect.any(Date),
    });

    // 第2位の根拠（relevanceScore: 0.85）
    expect(recordResult.records[1]).toEqual({
      recommendationBasisId: expect.any(String),
      recommendationId: "rec_20240115_001",
      dealId: "deal_20240115_0042",
      customerId: "cust_M001",
      priority: 2,
      relevanceScore: 0.85,
      description:
        "予算規模が500万円～1000万円帯で、過去成功パターンと合致",
      evidence: ["budget_range_5M_10M", "pattern_match"],
      recordedTimestamp: expect.any(Date),
    });

    // 第3位の根拠（relevanceScore: 0.72）
    expect(recordResult.records[2]).toEqual({
      recommendationBasisId: expect.any(String),
      recommendationId: "rec_20240115_001",
      dealId: "deal_20240115_0042",
      customerId: "cust_M001",
      priority: 3,
      relevanceScore: 0.72,
      description:
        "導入期間が3ヶ月以内という急ぎニーズで、類似案件の成約率が68%",
      evidence: [
        "implementation_period_3months",
        "similar_deal_close_rate_68pct",
      ],
      recordedTimestamp: expect.any(Date),
    });

    // 優先度順（relevanceScoreの降順）が保証されていることを確認
    expect(recordResult.records[0].relevanceScore).toBeGreaterThan(
      recordResult.records[1].relevanceScore
    );
    expect(recordResult.records[1].relevanceScore).toBeGreaterThan(
      recordResult.records[2].relevanceScore
    );

    // 記録状態が正常であることを確認
    expect(recordResult.status).toBe("success");
    expect(recordResult.allRecordsOrdered).toBe(true);
  });
});