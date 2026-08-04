import { analyzeProposalAndCustomerPattern } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-2308
  test("提案内容と顧客対応パターンの標準プロセス比較機能 - 顧客対応記録に重複データが含まれるとき重複が除外されて比較される", () => {
    // 準備: 重複を含む顧客対応記録データセット
    const customerId = "CUST-00001";
    const dealDate = "2024-01-15T10:00:00Z";
    const responseContent = "提案内容: 予算削減ソリューション";

    const customerRecords = [
      {
        customerId: customerId,
        dealDate: dealDate,
        responseContent: responseContent,
        recordId: "REC-001",
      },
      {
        customerId: customerId,
        dealDate: dealDate,
        responseContent: responseContent,
        recordId: "REC-002",
      },
      {
        customerId: customerId,
        dealDate: "2024-01-16T14:30:00Z",
        responseContent: "フォローアップ: 契約条件調整",
        recordId: "REC-003",
      },
    ];

    const newDealCondition = {
      customerId: customerId,
      industry: "製造業",
      scale: "中堅企業",
      proposalContent: "予算削減ソリューション",
    };

    // AIRecommendationEngineのスタブ設定
    // findSimilarPatternsが重複を含む過去成功パターンリストを返す
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest
        .fn()
        .mockReturnValue([
          {
            patternId: "PAT-001",
            matchScore: 0.92,
            successRate: 0.88,
            pastDealId: "DEAL-001",
            approach: "段階的提案",
          },
          {
            patternId: "PAT-001",
            matchScore: 0.92,
            successRate: 0.88,
            pastDealId: "DEAL-001",
            approach: "段階的提案",
          },
          {
            patternId: "PAT-002",
            matchScore: 0.85,
            successRate: 0.82,
            pastDealId: "DEAL-002",
            approach: "経営層説得",
          },
        ]),
      generateRecommendation: jest
        .fn()
        .mockReturnValue({
          recommendation: "段階的提案を採用",
          confidence: 0.88,
        }),
    };

    // 比較機能の実行
    const comparisonResult = analyzeProposalAndCustomerPattern(
      customerRecords,
      newDealCondition,
      aiRecommendationEngineStub
    );

    // 検証1: 重複が除外されたことを確認
    const uniquePatterns = comparisonResult.uniquePatterns;
    expect(uniquePatterns.length).toBe(2);

    // 検証2: 除外されたパターンが正確に識別されたことを確認
    const patternIdCounts = uniquePatterns.reduce(
      (acc: Record<string, number>, pattern) => {
        acc[pattern.patternId] = (acc[pattern.patternId] || 0) + 1;
        return acc;
      },
      {}
    );
    expect(patternIdCounts["PAT-001"]).toBe(1);
    expect(patternIdCounts["PAT-002"]).toBe(1);

    // 検証3: マッチング件数が重複を考慮しない正確な数値であることを確認
    expect(comparisonResult.matchingPatternCount).toBe(2);

    // 検証4: 標準プロセスとの照合スコアが計算されたことを確認
    expect(comparisonResult.standardProcessAlignmentScore).toBe(85);

    // 検証5: 重複除外前後のパターン数の差を確認
    const beforeDeduplication = 3;
    const afterDeduplication = comparisonResult.matchingPatternCount;
    expect(beforeDeduplication - afterDeduplication).toBe(1);

    // 検証6: 顧客対応記録の重複が除外されたことを確認
    const uniqueCustomerRecords =
      comparisonResult.processedCustomerRecords;
    expect(uniqueCustomerRecords.length).toBe(2);
    expect(
      uniqueCustomerRecords.filter(
        (r) => r.dealDate === dealDate && r.responseContent === responseContent
      ).length
    ).toBe(1);
  });
});