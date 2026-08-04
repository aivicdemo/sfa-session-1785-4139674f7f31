import { validateLearningDataAndExecuteRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-026: [edge] 学習データ量・品質検証機能 - 学習データ件数がちょうど最小要件に達した場合に推論実行が許可される
  test("学習データ件数が最小要件と同数で品質基準を満たす場合、推論実行が許可される", () => {
    const MINIMUM_REQUIRED_RECORDS = 1000;
    const QUALITY_THRESHOLD_RATE = 0.95;

    // トレーニングデータレコードの生成: 最小要件件数と同じ1000件
    const trainingRecords = Array.from({ length: MINIMUM_REQUIRED_RECORDS }, (_, i) => ({
      recordId: `training_${i}`,
      customerId: `customer_${i % 100}`,
      dealAmount: 50000 + (i * 1000) % 100000,
      industry: ["製造", "流通", "金融", "サービス"][i % 4],
      dealStage: ["初期接触", "提案", "交渉", "成約"][i % 4],
      outcome: i % 10 !== 0 ? "成功" : "失敗",
      timestamp: new Date("2024-01-01T00:00:00Z").getTime() + i * 86400000,
    }));

    // データ品質検証: 欠損率・重複率・異常値率を計算
    // 全レコードが必須フィールドを持つと仮定 (欠損率 = 0)
    // 重複なし (重複率 = 0)
    // 異常値なし (異常値率 = 0)
    const missingRate = 0;
    const duplicateRate = 0;
    const anomalyRate = 0;
    const qualityScore = 1 - (missingRate + duplicateRate + anomalyRate) / 3;
    // qualityScore = 1.0 (100% 品質スコア)

    // 品質基準適合率を計算: すべてのレコードが基準を満たす
    const qualityCompliantCount = trainingRecords.filter(
      (record) => qualityScore >= QUALITY_THRESHOLD_RATE
    ).length;
    const qualityCompliantRate = qualityCompliantCount / trainingRecords.length;
    // qualityCompliantRate = 1.0 (100%)

    // AIRecommendationEngineのスタブ化
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_001",
        approachStrategy: "標準提案アプローチA",
        confidence: 0.92,
        reasoning: "過去事例との類似度が高い",
      }),
    };

    // 推論実行許可判定ロジックの実行
    const result = validateLearningDataAndExecuteRecommendation(
      {
        trainingRecords,
        minimumRequiredRecords: MINIMUM_REQUIRED_RECORDS,
        qualityThresholdRate: QUALITY_THRESHOLD_RATE,
      },
      mockAIEngine
    );

    // 期待結果の検証
    // 1. 推論実行許可が『許可(true)』を返すこと
    expect(result.isExecutionPermitted).toBe(true);

    // 2. 学習データ有効件数が最小要件以上であること
    expect(result.validRecordCount).toBe(MINIMUM_REQUIRED_RECORDS);

    // 3. 品質基準適合率が閾値以上であること
    expect(result.qualityCompliantRate).toBe(1.0);

    // 4. AIRecommendationEngineのスタブ化メソッドが実際に呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    // 5. AIRecommendationEngineが正しい入力で呼び出されていること
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        trainingDataCount: MINIMUM_REQUIRED_RECORDS,
        qualityScore: 1.0,
      })
    );
  });
});