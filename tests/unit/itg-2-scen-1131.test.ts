import { normalizeCustomerAddress } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1131
  test("顧客住所が正規化ルールに基づいて正規化される", () => {
    const testCases = [
      {
        input: "東京都渋谷区道玄坂１－２－３",
        description: "全角数字とハイフン混在パターン",
      },
      {
        input: "東京都　渋谷区　道玄坂　1-2-3",
        description: "表記ゆれと空白を含むパターン",
      },
      {
        input: "東京都渋谷区道玄坂１－２－３",
        description: "半角・全角混在パターン",
      },
    ];

    const expectedNormalizedAddress = "東京都渋谷区道玄坂1-2-3";

    testCases.forEach((testCase) => {
      const result = normalizeCustomerAddress(testCase.input);
      expect(result).toBe(expectedNormalizedAddress);
    });
  });
});