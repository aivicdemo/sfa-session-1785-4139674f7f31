import { recordCustomerReaction, getCustomerReactionHistory } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-306: [normal] 顧客反応記録・標準化機能 - 複数回の顧客反応記録が時系列で正しく蓄積される
  test("複数回の顧客反応記録が時系列で正しく蓄積される", () => {
    const customer_id = "C001";
    const reaction_1_content = "提案資料に興味あり";
    const reaction_1_timestamp = new Date("2024-01-15T09:30:00Z");
    const reaction_2_content = "オンライン打ち合わせ希望";
    const reaction_2_timestamp = new Date("2024-01-15T14:45:00Z");
    const reaction_3_content = "契約書確認中";
    const reaction_3_timestamp = new Date("2024-01-16T11:20:00Z");

    // 1件目の反応記録を登録
    const response_1 = recordCustomerReaction({
      customer_id: customer_id,
      reaction_content: reaction_1_content,
      reaction_timestamp: reaction_1_timestamp,
    });

    expect(response_1).toEqual({
      sequence_number: 1,
      customer_id: customer_id,
      reaction_content: reaction_1_content,
      reaction_timestamp: reaction_1_timestamp,
    });

    // 2件目の反応記録を登録
    const response_2 = recordCustomerReaction({
      customer_id: customer_id,
      reaction_content: reaction_2_content,
      reaction_timestamp: reaction_2_timestamp,
    });

    expect(response_2).toEqual({
      sequence_number: 2,
      customer_id: customer_id,
      reaction_content: reaction_2_content,
      reaction_timestamp: reaction_2_timestamp,
    });

    // 3件目の反応記録を登録
    const response_3 = recordCustomerReaction({
      customer_id: customer_id,
      reaction_content: reaction_3_content,
      reaction_timestamp: reaction_3_timestamp,
    });

    expect(response_3).toEqual({
      sequence_number: 3,
      customer_id: customer_id,
      reaction_content: reaction_3_content,
      reaction_timestamp: reaction_3_timestamp,
    });

    // 顧客ID「C001」の反応記録一覧を時系列順序で取得
    const history = getCustomerReactionHistory({
      customer_id: customer_id,
    });

    expect(history).toEqual({
      customer_id: customer_id,
      reaction_records: [
        {
          sequence_number: 1,
          reaction_content: reaction_1_content,
          reaction_timestamp: reaction_1_timestamp,
        },
        {
          sequence_number: 2,
          reaction_content: reaction_2_content,
          reaction_timestamp: reaction_2_timestamp,
        },
        {
          sequence_number: 3,
          reaction_content: reaction_3_content,
          reaction_timestamp: reaction_3_timestamp,
        },
      ],
      total_count: 3,
    });

    // 各反応記録が時系列順序で格納されていることを確認
    expect(history.reaction_records[0].sequence_number).toBe(1);
    expect(history.reaction_records[1].sequence_number).toBe(2);
    expect(history.reaction_records[2].sequence_number).toBe(3);
    expect(history.reaction_records[0].reaction_timestamp < history.reaction_records[1].reaction_timestamp).toBe(true);
    expect(history.reaction_records[1].reaction_timestamp < history.reaction_records[2].reaction_timestamp).toBe(true);
  });
});