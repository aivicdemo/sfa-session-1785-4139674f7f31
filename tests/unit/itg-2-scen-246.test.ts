import { mergeCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-246
  test("重複候補の顧客IDが欠けているとき、統合判定がエラーになる", async () => {
    const duplicateCandidates = [
      {
        customer_id: "CUST001",
        name: "株式会社A",
        email: "a@example.com",
      },
      {
        customer_id: null,
        name: "株式会社A",
        email: "a@example.com",
      },
    ];

    const requestBody = {
      merge_candidates: duplicateCandidates,
      merge_reason: "重複顧客の統合",
      executed_by: "IT_USER_001",
    };

    const response = await fetch("/api/merge-duplicates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    expect(response.status).toBe(400);

    const responseBody = await response.json();
    expect(responseBody.error_message).toMatch(/統合対象の顧客IDが不足しています/);
    expect(responseBody.error_message).toMatch(/候補B/);
  });
});