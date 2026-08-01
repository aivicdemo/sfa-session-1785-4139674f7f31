import { determineProblemResponseTiming } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-544
  test("問題対応タイミングの判定機能 - 対応時期の判定基準が欠けている場合、処理が失敗する", () => {
    const payloadWithoutCriteria = {
      problemId: "PROB-20240115-001",
      problemDescription: "営業データ品質スコアが低下",
      detectedAt: "2024-01-15T10:30:00Z",
      severityLevel: "HIGH",
    };

    expect(() => {
      determineProblemResponseTiming(payloadWithoutCriteria);
    }).toThrow(/判定基準/);
  });
});