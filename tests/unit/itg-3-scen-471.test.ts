import { generateRecommendationReportMetadata } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - レポートメタデータ生成", () => {
  test("SCEN-471: レポート生成対象期間が正しく記録される", () => {
    // システム日時を2026-08-15 10:30:00 UTCに固定
    const fixedNow = new Date("2026-08-15T10:30:00Z");
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: "approach_001",
        content: "test approach",
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue("test reasoning"),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(80),
    };

    // レポート生成対象期間を指定
    const periodStart = "2026-07-01";
    const periodEnd = "2026-08-15";

    // レポートメタデータ生成関数を呼び出す
    const metadata = generateRecommendationReportMetadata(
      {
        periodStart,
        periodEnd,
      },
      aiEngineStub
    );

    // メタデータ内のperiodStartプロパティの値を検証
    expect(metadata.periodStart).toBe("2026-07-01T00:00:00Z");

    // メタデータ内のperiodEndプロパティの値を検証
    expect(metadata.periodEnd).toBe("2026-08-15T23:59:59Z");

    // メタデータ内のgenerationTimestampプロパティの値を検証
    expect(metadata.generationTimestamp).toBe("2026-08-15T10:30:00Z");

    // メタデータのいずれのプロパティも指定した対象期間と異なる値を含まないことを確認
    expect(metadata).toEqual({
      periodStart: "2026-07-01T00:00:00Z",
      periodEnd: "2026-08-15T23:59:59Z",
      generationTimestamp: "2026-08-15T10:30:00Z",
    });

    jest.useRealTimers();
  });
});