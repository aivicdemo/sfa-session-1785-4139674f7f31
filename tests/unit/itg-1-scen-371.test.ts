import { generateSalesAnalysisReportByHandler } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-371
  test("複数の営業担当者の行動パターン分析結果が逆順で入力された場合に正常に処理される", () => {
    // 3人の営業担当者の行動パターン分析結果を準備（降順：最新から古い順）
    const analysisResultLatest = {
      handlerId: "handler_001",
      handlerName: "営業員A",
      analysisDate: "2024-03-15T10:00:00Z",
      visitCount: 25,
      proposalCount: 18,
      closingRate: 0.72,
      behaviorScore: 88,
      adherenceScore: 0.92,
      deviationPattern: "low_deviation",
    };

    const analysisResultMiddle = {
      handlerId: "handler_002",
      handlerName: "営業員B",
      analysisDate: "2024-03-08T10:00:00Z",
      visitCount: 20,
      proposalCount: 14,
      closingRate: 0.65,
      behaviorScore: 82,
      adherenceScore: 0.85,
      deviationPattern: "medium_deviation",
    };

    const analysisResultOldest = {
      handlerId: "handler_003",
      handlerName: "営業員C",
      analysisDate: "2024-03-01T10:00:00Z",
      visitCount: 18,
      proposalCount: 12,
      closingRate: 0.58,
      behaviorScore: 75,
      adherenceScore: 0.78,
      deviationPattern: "high_deviation",
    };

    // 入力順序を意図的に逆順（古い日時から最新へ）に並び替える
    const reversedAnalysisResults = [
      analysisResultOldest,
      analysisResultMiddle,
      analysisResultLatest,
    ];

    // レポート生成機能に入力
    const generatedReport = generateSalesAnalysisReportByHandler({
      analysisResults: reversedAnalysisResults,
      reportGeneratedDate: "2024-03-16T09:00:00Z",
    });

    // レポート生成が正常に完了したことを検証
    expect(generatedReport).toBeDefined();
    expect(generatedReport.status).toBe("completed");

    // レポート内の営業担当者別分析結果の並び順を検証（昇順：古い順）
    expect(generatedReport.analysisResultsSorted).toHaveLength(3);

    // 1番目：営業員C（最古データ）
    expect(generatedReport.analysisResultsSorted[0].handlerId).toBe(
      "handler_003"
    );
    expect(generatedReport.analysisResultsSorted[0].handlerName).toBe("営業員C");
    expect(generatedReport.analysisResultsSorted[0].analysisDate).toBe(
      "2024-03-01T10:00:00Z"
    );
    expect(generatedReport.analysisResultsSorted[0].visitCount).toBe(18);
    expect(generatedReport.analysisResultsSorted[0].proposalCount).toBe(12);
    expect(generatedReport.analysisResultsSorted[0].closingRate).toBe(0.58);
    expect(generatedReport.analysisResultsSorted[0].behaviorScore).toBe(75);
    expect(generatedReport.analysisResultsSorted[0].adherenceScore).toBe(0.78);
    expect(generatedReport.analysisResultsSorted[0].deviationPattern).toBe(
      "high_deviation"
    );

    // 2番目：営業員B
    expect(generatedReport.analysisResultsSorted[1].handlerId).toBe(
      "handler_002"
    );
    expect(generatedReport.analysisResultsSorted[1].handlerName).toBe("営業員B");
    expect(generatedReport.analysisResultsSorted[1].analysisDate).toBe(
      "2024-03-08T10:00:00Z"
    );
    expect(generatedReport.analysisResultsSorted[1].visitCount).toBe(20);
    expect(generatedReport.analysisResultsSorted[1].proposalCount).toBe(14);
    expect(generatedReport.analysisResultsSorted[1].closingRate).toBe(0.65);
    expect(generatedReport.analysisResultsSorted[1].behaviorScore).toBe(82);
    expect(generatedReport.analysisResultsSorted[1].adherenceScore).toBe(0.85);
    expect(generatedReport.analysisResultsSorted[1].deviationPattern).toBe(
      "medium_deviation"
    );

    // 3番目：営業員A（最新データ）
    expect(generatedReport.analysisResultsSorted[2].handlerId).toBe(
      "handler_001"
    );
    expect(generatedReport.analysisResultsSorted[2].handlerName).toBe("営業員A");
    expect(generatedReport.analysisResultsSorted[2].analysisDate).toBe(
      "2024-03-15T10:00:00Z"
    );
    expect(generatedReport.analysisResultsSorted[2].visitCount).toBe(25);
    expect(generatedReport.analysisResultsSorted[2].proposalCount).toBe(18);
    expect(generatedReport.analysisResultsSorted[2].closingRate).toBe(0.72);
    expect(generatedReport.analysisResultsSorted[2].behaviorScore).toBe(88);
    expect(generatedReport.analysisResultsSorted[2].adherenceScore).toBe(0.92);
    expect(generatedReport.analysisResultsSorted[2].deviationPattern).toBe(
      "low_deviation"
    );

    // 各営業担当者の分析データが改ざんされずに正確に格納されていることを検証
    expect(generatedReport.analysisResultsSorted[0]).toEqual({
      handlerId: "handler_003",
      handlerName: "営業員C",
      analysisDate: "2024-03-01T10:00:00Z",
      visitCount: 18,
      proposalCount: 12,
      closingRate: 0.58,
      behaviorScore: 75,
      adherenceScore: 0.78,
      deviationPattern: "high_deviation",
    });

    expect(generatedReport.analysisResultsSorted[1]).toEqual({
      handlerId: "handler_002",
      handlerName: "営業員B",
      analysisDate: "2024-03-08T10:00:00Z",
      visitCount: 20,
      proposalCount: 14,
      closingRate: 0.65,
      behaviorScore: 82,
      adherenceScore: 0.85,
      deviationPattern: "medium_deviation",
    });

    expect(generatedReport.analysisResultsSorted[2]).toEqual({
      handlerId: "handler_001",
      handlerName: "営業員A",
      analysisDate: "2024-03-15T10:00:00Z",
      visitCount: 25,
      proposalCount: 18,
      closingRate: 0.72,
      behaviorScore: 88,
      adherenceScore: 0.92,
      deviationPattern: "low_deviation",
    });

    // レポートのメタ情報を検証
    expect(generatedReport.reportGeneratedDate).toBe("2024-03-16T09:00:00Z");
    expect(generatedReport.totalHandlers).toBe(3);
  });
});