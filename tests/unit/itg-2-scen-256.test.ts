import { determineDuplicateIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-256
  test("同じ重複候補で2回統合判定を実行したとき、2回目も同じ結果が返される", () => {
    const duplicateCandidate = {
      customerId1: 1001,
      customerName1: "山田太郎",
      customerPhone1: "090-1234-5678",
      customerId2: 1002,
      customerName2: "山田太郎",
      customerPhone2: "090-1234-5678",
    };

    const firstResult = determineDuplicateIntegration(duplicateCandidate);
    const secondResult = determineDuplicateIntegration(duplicateCandidate);

    expect(firstResult.matchScore).toBe(secondResult.matchScore);
    expect(firstResult.isDuplicate).toBe(secondResult.isDuplicate);
    expect(firstResult.recommendedAction).toBe(secondResult.recommendedAction);
    expect(firstResult.matchedItems).toEqual(secondResult.matchedItems);
  });
});