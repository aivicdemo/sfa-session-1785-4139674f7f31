import { detectAndClassifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-531
  test("重複候補データが0件のとき、空の分類結果を返す", () => {
    const emptyClassificationResult = detectAndClassifyDuplicateCustomers([]);

    expect(emptyClassificationResult).toEqual({
      duplicateCandidateCount: 0,
      classificationGroupCount: 0,
      classificationRecords: []
    });
  });
});