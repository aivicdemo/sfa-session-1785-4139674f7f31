import { recordCustomerReaction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-311
  test("顧客反応記録・標準化機能 - フォローアップ完了の前提条件が満たされていない場合、顧客反応の記録がスキップされる", () => {
    const customer_reaction_record = {
      followup_completed_flag: false,
      followup_completed_datetime: "",
      customer_reaction_content: "提案内容に興味あり",
    };

    expect(() => recordCustomerReaction(customer_reaction_record)).toThrow(
      /フォローアップ完了日時/
    );
  });
});