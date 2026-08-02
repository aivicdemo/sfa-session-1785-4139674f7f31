import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  initializeSalesExampleCollectionEngine,
  generateSalesExampleCollectionDefinition,
} from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ収集定義エンジン", () => {
  // SCEN-1077
  test("同じ開催決定条件で2回実行しても同じ定義が生成される", () => {
    // 初期化：エンジンをリセット
    initializeSalesExampleCollectionEngine();

    // 開催決定条件を設定
    const hostingCondition = {
      hostingDateTime: new Date("2024-06-15T14:00:00Z"),
      minimumParticipants: 3,
      budgetLimit: 500000,
      dealStatus: "商談中",
    };

    // 第1回目の定義生成
    const firstGenerationResult =
      generateSalesExampleCollectionDefinition(hostingCondition);

    // 第1回目の結果を記録
    const firstDefinitionId = firstGenerationResult.definitionId;
    const firstFilterRules = firstGenerationResult.filterRules;
    const firstExtractionConditions =
      firstGenerationResult.extractionConditions;

    // エンジンをリセット
    initializeSalesExampleCollectionEngine();

    // 同じ条件で第2回目の定義生成を実行
    const secondGenerationResult =
      generateSalesExampleCollectionDefinition(hostingCondition);

    // 第2回目の結果を記録
    const secondDefinitionId = secondGenerationResult.definitionId;
    const secondFilterRules = secondGenerationResult.filterRules;
    const secondExtractionConditions =
      secondGenerationResult.extractionConditions;

    // 第1回目と第2回目のフィルタルールが一致することを検証
    expect(firstFilterRules).toEqual({
      hostingDateTime: new Date("2024-06-15T14:00:00Z"),
      minimumParticipants: 3,
      budgetLimit: 500000,
      dealStatus: "商談中",
    });

    expect(secondFilterRules).toEqual({
      hostingDateTime: new Date("2024-06-15T14:00:00Z"),
      minimumParticipants: 3,
      budgetLimit: 500000,
      dealStatus: "商談中",
    });

    // 第1回目と第2回目のフィルタルールが完全に一致
    expect(firstFilterRules).toEqual(secondFilterRules);

    // 定義IDは同じ条件で同じ値が生成される
    expect(firstDefinitionId).toBe(secondDefinitionId);

    // 抽出条件も一致する
    expect(firstExtractionConditions).toEqual(secondExtractionConditions);
  });
});