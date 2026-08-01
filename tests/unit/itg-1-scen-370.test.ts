import { generateSalesPersonPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-370
  test("失敗パターンとして複数の行動パターンが共存するとき、全てが抽出される", () => {
    const salesPersonId = "SP-001";
    const analysisStartDate = "2024-01-01T00:00:00Z";
    const analysisEndDate = "2024-01-31T23:59:59Z";

    const failurePatterns = [
      {
        patternId: "FP-001",
        patternName: "初回接触後30日以上フォローアップなし",
        detectedCount: 2,
        affectedCases: 2,
      },
      {
        patternId: "FP-002",
        patternName: "提案資料送付後返信待機中に別案件へ移行",
        detectedCount: 1,
        affectedCases: 1,
      },
      {
        patternId: "FP-003",
        patternName: "顧客ニーズヒアリング未実施のまま見積提出",
        detectedCount: 1,
        affectedCases: 1,
      },
    ];

    const input = {
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      failurePatterns,
    };

    const result = generateSalesPersonPatternAnalysisReport(input);

    expect(result).toEqual({
      reportId: expect.any(String),
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      failurePatternsExtracted: expect.arrayContaining([
        expect.objectContaining({
          patternName: "初回接触後30日以上フォローアップなし",
        }),
        expect.objectContaining({
          patternName: "提案資料送付後返信待機中に別案件へ移行",
        }),
        expect.objectContaining({
          patternName: "顧客ニーズヒアリング未実施のまま見積提出",
        }),
      ]),
      failurePatternCount: 3,
      generatedAt: expect.any(String),
    });

    expect(result.failurePatternsExtracted).toHaveLength(3);
    expect(
      result.failurePatternsExtracted.map((p) => p.patternName)
    ).toEqual(
      expect.arrayContaining([
        "初回接触後30日以上フォローアップなし",
        "提案資料送付後返信待機中に別案件へ移行",
        "顧客ニーズヒアリング未実施のまま見積提出",
      ])
    );
  });
});