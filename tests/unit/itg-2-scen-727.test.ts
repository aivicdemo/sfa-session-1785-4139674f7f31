import { calculateProposalNeedsCompatibility } from "../../src/logic/it-1-br-2-2-1-1";

describe("提案資料と顧客ニーズの適合度スコア化機能", () => {
  // SCEN-727
  test("複数の不適合項目が存在するとき、全ての不適合項目が明示される", () => {
    const proposalData = {
      proposalAmount: 5000000,
      proposalDeliveryMonths: 3,
      includedFeatures: ["ダッシュボード", "ユーザー管理", "データ連携"],
    };

    const customerNeeds = {
      budgetLimit: 4000000,
      requiredDeliveryMonths: 2,
      requiredFeatures: [
        "ダッシュボード",
        "ユーザー管理",
        "レポート自動生成",
      ],
    };

    const result = calculateProposalNeedsCompatibility(
      proposalData,
      customerNeeds
    );

    expect(result.incompatibilityCount).toBe(3);
    expect(result.incompatibilityItems).toEqual(
      expect.arrayContaining([
        {
          itemName: "予算",
          reason: "提案額5000000円が顧客予算上限4000000円を超過",
        },
        {
          itemName: "納期",
          reason: "提案納期3ヶ月が顧客要求納期2ヶ月に未達",
        },
        {
          itemName: "機能",
          reason:
            '顧客要求機能「レポート自動生成」が提案範囲に含まれていない',
        },
      ])
    );
    expect(result.incompatibilityItems.length).toBe(3);
  });
});