import { detectDuplicateCustomerWithAddressMatch } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-103
  test("住所が一致する場合、重複確度判定に加味される", () => {
    const customerA = {
      id: "CUST-001",
      name: "山田太郎",
      address: "東京都渋谷区道玄坂1-2-3",
      phone: "09012345678",
    };

    const customerB = {
      id: "CUST-002",
      name: "山田太郎",
      address: "東京都渋谷区道玄坂1-2-3",
      phone: "09087654321",
    };

    const result = detectDuplicateCustomerWithAddressMatch(
      customerA,
      customerB
    );

    expect(result.scoreWithoutAddress).toBeLessThan(70);
    expect(result.scoreWithAddress).toBeGreaterThanOrEqual(70);
    expect(result.scoreWithAddress - result.scoreWithoutAddress).toBeGreaterThanOrEqual(
      10
    );
    expect(result.duplicateLikelihood).toBe("high");
    expect(result.isMergeCandidate).toBe(true);
  });
});