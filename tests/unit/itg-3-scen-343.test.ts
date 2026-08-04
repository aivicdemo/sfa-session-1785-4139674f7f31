import {
  recordRecommendationAccuracy,
  getAccuracyMetrics,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度検証機能 - 成功パターンマッチ精度計測", () => {
  test("SCEN-343: 成功パターンマッチした推奨結果が精度計測テーブルに記録される", () => {
    // Arrange: モック化されたAIRecommendationEngineの戻り値を定義
    const mockRecommendationResult = {
      patternId: "PATTERN-001",
      matchType: "success",
      similarityScore: 0.95,
      matchedPatternName: "大企業向け段階的提案",
      recommendedApproach: "段階的なニーズ把握から提案実行",
    };

    const recordedAtTimestamp = new Date("2026-08-01T10:30:00Z");

    // Act: 推奨精度検証機能のrecordRecommendationAccuracyメソッドを呼び出し
    recordRecommendationAccuracy({
      patternId: mockRecommendationResult.patternId,
      matchType: mockRecommendationResult.matchType,
      similarityScore: mockRecommendationResult.similarityScore,
      matchedPatternName: mockRecommendationResult.matchedPatternName,
      includeInMetrics: true,
      recordedAt: recordedAtTimestamp,
    });

    // Assert: 精度計測テーブルから当該パターンを取得して検証
    const metrics = getAccuracyMetrics({
      patternId: "PATTERN-001",
    });

    // 計測対象フラグがtrueであることを確認
    expect(metrics.includeInMetrics).toBe(true);

    // matchTypeが'success'として保存されていることを確認
    expect(metrics.matchType).toBe("success");

    // 記録されたsimilarityScoreが0.95であることを確認
    expect(metrics.similarityScore).toBe(0.95);

    // recordedAtタイムスタンプが期待値であることを確認
    expect(metrics.recordedAt).toEqual(recordedAtTimestamp);

    // パターンIDが正しく保存されていることを確認
    expect(metrics.patternId).toBe("PATTERN-001");

    // 計測対象レコード数にカウントされていることを確認
    const metricsCount = getAccuracyMetrics({
      includeInMetricsOnly: true,
    });
    expect(metricsCount.totalRecordedCount).toBeGreaterThanOrEqual(1);
  });
});