import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-748
  test("反応パターンが0件のとき、購買シグナル強度の計算が正しく進行する", () => {
    const customerId = "CUST-001";
    const reactionPatterns: any[] = [];
    const calculationLogs: string[] = [];

    const result = calculatePurchaseSignalStrength(
      customerId,
      reactionPatterns,
      calculationLogs
    );

    expect(result).not.toThrow;
    expect(typeof result).toBe("number");
    expect(result).toBe(0.0);

    const expectedLogMessage =
      "反応パターン件数: 0件、基準値未満のため購買シグナル強度を0.0に設定";
    const logExists = calculationLogs.some((log) =>
      log.includes(expectedLogMessage)
    );
    expect(logExists).toBe(true);
  });
});