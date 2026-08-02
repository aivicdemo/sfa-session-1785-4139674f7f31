import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-136: 電話番号が欠落しているレコードは検査対象外に除外される", () => {
    // 準備: レコードA（電話番号欠落）
    const recordA = {
      id: "CUST_001",
      name: "株式会社ABC",
      address: "東京都渋谷区神宮前1-1-1",
      email: "contact@abc.com",
      phone: "",
    };

    // 準備: レコードB（完全なデータ）
    const recordB = {
      id: "CUST_002",
      name: "株式会社ABC",
      address: "東京都渋谷区神宮前1-1-1",
      email: "contact@abc.com",
      phone: "03-1234-5678",
    };

    // 入力
    const input = {
      records: [recordA, recordB],
      masterServiceConfig: {
        baseUrl: "https://api.example.com",
        timeout: 5000,
      },
    };

    // 実行
    const result = detectDuplicateCustomers(input);

    // 検証: レコードAは検査対象外に除外される
    expect(result.excludedRecords).toContain(recordA.id);
    expect(result.excludedRecords).toEqual(["CUST_001"]);

    // 検証: 重複候補リストにレコードAが含まれない
    const duplicatePairs = result.duplicateCandidates.map((pair) => [
      pair.recordId1,
      pair.recordId2,
    ]);
    const hasPairWithA = duplicatePairs.some(
      (pair) => pair.includes(recordA.id) || pair.includes(recordB.id)
    );
    expect(hasPairWithA).toBe(false);

    // 検証: 統合対象の判定結果にレコードAが表示されない
    const mergeTargets = result.mergeTargets.map((target) => target.recordId);
    expect(mergeTargets).not.toContain(recordA.id);

    // 検証: エラーログに除外理由が記録される
    expect(result.errorLog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recordId: "CUST_001",
          reason: expect.stringMatching(/電話番号が欠落/),
        }),
      ])
    );
  });
});