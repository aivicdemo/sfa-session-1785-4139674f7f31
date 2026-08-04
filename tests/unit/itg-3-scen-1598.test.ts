import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-1598
  test("類似顧客マッチング処理 - 過去顧客データが1件のとき、1顧客のみ一致度判定の対象となる", async () => {
    const pastCustomers = [
      {
        customerId: "CUST-001",
        companyName: "テスト企業A",
        industry: "製造業",
        successPattern: "パターンX",
      },
    ];

    const newDealCondition = {
      companyName: "新規企業B",
      industry: "製造業",
      budgetScale: "500万円",
    };

    const matchingTargetList = await findSimilarPatterns(
      pastCustomers,
      newDealCondition
    );

    expect(matchingTargetList).toHaveLength(1);
    expect(matchingTargetList[0]).toEqual({
      customerId: "CUST-001",
      companyName: "テスト企業A",
      industry: "製造業",
      successPattern: "パターンX",
    });
  });
});