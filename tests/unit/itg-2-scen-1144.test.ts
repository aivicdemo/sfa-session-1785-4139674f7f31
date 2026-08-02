import { detectDuplicateAndNormalize } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1144
  test("同じ入力データで2回検証を実行した場合、同じ結果が得られる", () => {
    const inputCustomer = {
      customerId: "C-20240115-001",
      name: "山田太郎",
      email: "yamada.taro@example.com",
      phone: "090-1234-5678",
    };

    const firstResult = detectDuplicateAndNormalize(inputCustomer);
    const secondResult = detectDuplicateAndNormalize(inputCustomer);

    expect(firstResult.duplicateScore).toBe(secondResult.duplicateScore);
    expect(firstResult.inconsistencyFlags).toEqual(
      secondResult.inconsistencyFlags
    );
    expect(firstResult.normalizedData).toEqual(secondResult.normalizedData);
    expect(firstResult.mergeJudgmentStatus).toBe(
      secondResult.mergeJudgmentStatus
    );
  });
});