import { detectAndClassifyDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-555
  test("同じ重複候補ペアが重複データリストに2度出現するとき、両方の検出を分類結果に記録する", () => {
    const duplicateDataList = [
      {
        id1: "cust_001",
        id2: "cust_002",
      },
      {
        id1: "cust_001",
        id2: "cust_002",
      },
    ];

    const classificationResult = detectAndClassifyDuplicates(
      duplicateDataList
    );

    expect(classificationResult).toHaveLength(2);

    expect(classificationResult[0]).toEqual(
      expect.objectContaining({
        id1: "cust_001",
        id2: "cust_002",
        classificationStatus: expect.any(String),
        classificationTimestamp: expect.any(String),
      })
    );

    expect(classificationResult[1]).toEqual(
      expect.objectContaining({
        id1: "cust_001",
        id2: "cust_002",
        classificationStatus: expect.any(String),
        classificationTimestamp: expect.any(String),
      })
    );

    const duplicatePairCount = classificationResult.filter(
      (item) => item.id1 === "cust_001" && item.id2 === "cust_002"
    ).length;

    expect(duplicatePairCount).toBe(2);

    const firstTimestamp = new Date(
      classificationResult[0].classificationTimestamp
    ).getTime();
    const secondTimestamp = new Date(
      classificationResult[1].classificationTimestamp
    ).getTime();

    expect(typeof firstTimestamp).toBe("number");
    expect(typeof secondTimestamp).toBe("number");
    expect(firstTimestamp > 0).toBe(true);
    expect(secondTimestamp > 0).toBe(true);
  });
});