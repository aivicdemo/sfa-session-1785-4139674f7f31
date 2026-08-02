import { describe, test, expect } from "@jest/globals";
import { judgeDuplicateIntegration } from "../../src/logic/it-1-br-2-2-1-1";

// SCEN-520
describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-520: 重複候補データが空のときエラーが発生する", () => {
    const emptyDuplicateCandidates: any[] = [];

    expect(() => {
      judgeDuplicateIntegration({
        duplicateCandidates: emptyDuplicateCandidates,
      });
    }).toThrow(/重複候補データが空です/);
  });
});