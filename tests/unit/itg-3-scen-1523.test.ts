import { evaluateDataQualityForLearning } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定と AIエージェント呼び出し許可フラグ", () => {
  // SCEN-1523
  test("品質判定結果が学習データ可能なときAIエージェント呼び出し可能フラグがtrueで返される", () => {
    const purchaseHistoryData = {
      customerId: "CUST-00001",
      purchaseDateTime: new Date("2024-01-15T10:30:00Z"),
      productCategory: "ソフトウェアライセンス",
      amount: 500000,
      purchaseReason: "業務効率化",
    };

    const result = evaluateDataQualityForLearning(purchaseHistoryData);

    expect(result.aiAgentCallableFlag).toBe(true);
    expect(typeof result.aiAgentCallableFlag).toBe("boolean");
    expect(result.qualityJudgment).toBe("学習データ可能");
  });
});