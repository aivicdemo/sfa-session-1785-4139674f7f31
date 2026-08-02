import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-750: 購買シグナル強度算出機能 - 反応パターンが複数件のとき、最新の反応パターンのみが優先される", () => {
    const customerId = "CUS-001";
    const reactionPatterns = [
      {
        customerId: "CUS-001",
        timestamp: new Date("2024-01-10T09:00:00Z"),
        strength: 0.6,
      },
      {
        customerId: "CUS-001",
        timestamp: new Date("2024-01-15T14:30:00Z"),
        strength: 0.75,
      },
      {
        customerId: "CUS-001",
        timestamp: new Date("2024-01-20T10:15:00Z"),
        strength: 0.85,
      },
    ];

    const result = calculatePurchaseSignalStrength(customerId, reactionPatterns);

    expect(result.strength).toBe(0.85);
    expect(result.referencePatternTimestamp).toEqual(
      new Date("2024-01-20T10:15:00Z")
    );
  });
});