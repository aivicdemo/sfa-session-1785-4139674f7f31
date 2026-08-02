import { detectDuplicateAndInconsistency } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-820: 同一入力で2回実行した場合、統合判定結果が同じである", () => {
    const input = {
      customerName: "山田太郎",
      email: "yamada@example.com",
      phoneNumber: "09012345678",
      address: "東京都渋谷区道玄坂1-2-3",
    };

    const result1 = detectDuplicateAndInconsistency(input);
    const result2 = detectDuplicateAndInconsistency(input);

    expect(result1.isDuplicate).toBe(result2.isDuplicate);
    expect(result1.hasInconsistency).toBe(result2.hasInconsistency);
    expect(Math.round(result1.riskScore * 100) / 100).toBe(
      Math.round(result2.riskScore * 100) / 100
    );
    expect(result1.inconsistencyItems).toEqual(result2.inconsistencyItems);
  });
});