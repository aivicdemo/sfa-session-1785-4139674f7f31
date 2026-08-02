import { detectSignalBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-758
  test("信号検出根拠生成機能 - 反応パターンが0件のとき、根拠にパターンなしである旨が記載される", () => {
    const input = {
      customerId: "CUST-001",
      lastContactDate: "2024-01-15",
      purchaseCycle: 30,
      reactionPatterns: [],
    };

    const result = detectSignalBasis(input);

    expect(result).toEqual({
      customerId: "CUST-001",
      signalStrength: "weak",
      patternInfo: "検出された反応パターンはありません",
      lastContactDate: "2024-01-15",
      purchaseCycle: 30,
    });
  });
});