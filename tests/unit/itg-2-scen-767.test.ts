import { generateSignalDetectionReason } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-767: [normal] 信号検出根拠生成機能 - 購買周期と反応パターンは揃うが最終接触日が空のとき、根拠に2要素のみが記載される", () => {
    const testData = {
      purchaseCycleDays: 30,
      responsePattern: "メール開封",
      lastContactDate: null,
    };

    const result = generateSignalDetectionReason(testData);

    expect(result).toEqual({
      purchaseCycleDays: 30,
      responsePattern: "メール開封",
    });

    expect(Object.keys(result).length).toBe(2);
    expect(result.lastContactDate).toBeUndefined();
  });
});