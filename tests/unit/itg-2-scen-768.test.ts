import { generateSignalDetectionRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-768
  test("信号検出根拠生成機能 - 3要素すべてが不足のとき、根拠に判定根拠不足である旨が記載される", () => {
    const input = {
      creditScore: null,
      transactionHistory: null,
      paymentRecord: null,
    };

    const result = generateSignalDetectionRationale(input);

    expect(result.judgmentReason).toBe(
      "判定根拠不足：必要な3要素（顧客信用スコア、取引履歴、支払い実績）がすべて不足しています"
    );
  });
});