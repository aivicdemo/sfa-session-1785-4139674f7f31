import { describe, it, expect, beforeEach } from "@jest/globals";
import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-668
  it("推奨内容根拠の可視化機能 - 入力された顧客IDが空文字のとき、エラーが発生する", () => {
    const customerId = "";

    expect(() => visualizeRecommendationBasis({ customerId })).toThrow(
      /顧客ID/
    );
  });
});