import { judgeIntegrationCandidates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-400
  test("統合判定で確度50%以上99%未満と判定された顧客ペアが返される", () => {
    const duplicateDetectionResults = [
      {
        customer_id_1: "C001",
        customer_id_2: "C002",
        confidence: 0.30,
      },
      {
        customer_id_1: "C003",
        customer_id_2: "C004",
        confidence: 0.50,
      },
      {
        customer_id_1: "C005",
        customer_id_2: "C006",
        confidence: 0.75,
      },
      {
        customer_id_1: "C007",
        customer_id_2: "C008",
        confidence: 0.90,
      },
      {
        customer_id_1: "C009",
        customer_id_2: "C010",
        confidence: 0.98,
      },
      {
        customer_id_1: "C011",
        customer_id_2: "C012",
        confidence: 0.99,
      },
      {
        customer_id_1: "C013",
        customer_id_2: "C014",
        confidence: 1.0,
      },
    ];

    const result = judgeIntegrationCandidates(duplicateDetectionResults);

    expect(result).toHaveLength(4);
    expect(result).toEqual([
      {
        customer_id_1: "C003",
        customer_id_2: "C004",
        confidence: 0.50,
      },
      {
        customer_id_1: "C005",
        customer_id_2: "C006",
        confidence: 0.75,
      },
      {
        customer_id_1: "C007",
        customer_id_2: "C008",
        confidence: 0.90,
      },
      {
        customer_id_1: "C009",
        customer_id_2: "C010",
        confidence: 0.98,
      },
    ]);

    result.forEach((pair) => {
      expect(pair.confidence).toBeGreaterThanOrEqual(0.5);
      expect(pair.confidence).toBeLessThan(0.99);
    });
  });
});