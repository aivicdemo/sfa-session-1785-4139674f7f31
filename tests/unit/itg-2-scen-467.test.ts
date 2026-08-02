import { detectCustomerDuplicateAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-467
  test("同じ顧客データで複数回判定を実行した場合、毎回同じ結果が返される", () => {
    const testCustomerData = {
      customerId: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
    };

    const result1 = detectCustomerDuplicateAndJudgeIntegration(testCustomerData);
    const result2 = detectCustomerDuplicateAndJudgeIntegration(testCustomerData);
    const result3 = detectCustomerDuplicateAndJudgeIntegration(testCustomerData);

    expect(result1.isDuplicate).toBe(result2.isDuplicate);
    expect(result2.isDuplicate).toBe(result3.isDuplicate);

    expect(result1.duplicateScore).toBe(result2.duplicateScore);
    expect(result2.duplicateScore).toBe(result3.duplicateScore);

    expect(result1.mergeRecommended).toBe(result2.mergeRecommended);
    expect(result2.mergeRecommended).toBe(result3.mergeRecommended);

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
});