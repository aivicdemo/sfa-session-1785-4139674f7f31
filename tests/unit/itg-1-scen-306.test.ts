import { evaluateDataQuality } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-306
  test("システムヘルスチェック判定機能 - 営業データ品質が合格基準内であることが判定される", () => {
    const dataQualityMetrics = {
      completenessScore: 95,
      accuracyScore: 92,
      timelinessScore: 88,
      consistencyScore: 94,
    };

    const passingCriteria = {
      minPerItemThreshold: 85,
      minOverallThreshold: 90,
    };

    const result = evaluateDataQuality(dataQualityMetrics, passingCriteria);

    expect(result.passedOverallJudgment).toBe(true);
    expect(result.completenessScore).toBe(95);
    expect(result.accuracyScore).toBe(92);
    expect(result.timelinessScore).toBe(88);
    expect(result.consistencyScore).toBe(94);
    expect(result.overallScore).toBe(92.25);
    expect(result.judgmentStatus).toBe("合格");
  });
});