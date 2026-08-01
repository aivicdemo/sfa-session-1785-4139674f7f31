import { analyzeActionPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者行動パターン分析レポート生成機能", () => {
  test("SCEN-822: 同じ入力条件で分析を2回実行したとき、両回とも同じ乖離度と分類結果が得られる", () => {
    // 分析条件の定義
    const analysisCondition = {
      salespersonId: "SA001",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      granularity: "daily" as const,
    };

    // 1回目の分析実行
    const firstAnalysisResult = analyzeActionPattern(analysisCondition);

    // 1回目の分析結果から値を記録
    const firstDeviationScore = firstAnalysisResult.deviationScore;
    const firstBehaviorClassification = firstAnalysisResult.behaviorClassification;
    const firstClassificationCounts = firstAnalysisResult.classificationCounts;

    // 2回目の分析実行（同じ条件）
    const secondAnalysisResult = analyzeActionPattern(analysisCondition);

    // 2回目の分析結果から値を取得
    const secondDeviationScore = secondAnalysisResult.deviationScore;
    const secondBehaviorClassification = secondAnalysisResult.behaviorClassification;
    const secondClassificationCounts = secondAnalysisResult.classificationCounts;

    // 1回目と2回目の乖離度スコアが同じ（小数点以下5桁まで一致）
    expect(firstDeviationScore).toBe(secondDeviationScore);
    expect(Number(firstDeviationScore.toFixed(5))).toBe(
      Number(secondDeviationScore.toFixed(5))
    );

    // 1回目と2回目の行動分類結果が同一カテゴリ
    expect(firstBehaviorClassification).toBe(secondBehaviorClassification);

    // 1回目と2回目の各分類に属するレコード数が同一
    expect(firstClassificationCounts).toEqual(secondClassificationCounts);
    expect(firstClassificationCounts.aggressive).toBe(
      secondClassificationCounts.aggressive
    );
    expect(firstClassificationCounts.passive).toBe(
      secondClassificationCounts.passive
    );
    expect(firstClassificationCounts.standard).toBe(
      secondClassificationCounts.standard
    );

    // 分析結果全体が完全に一致することを確認
    expect(firstAnalysisResult).toEqual(secondAnalysisResult);
  });
});