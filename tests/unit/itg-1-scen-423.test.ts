import { recordCustomerReaction } from "../../src/logic/it-1-br-2-1-1";

describe("顧客反応の標準化分類・記録機能", () => {
  // SCEN-423
  test("複数の顧客反応がAIエージェントの学習データとして蓄積される", async () => {
    // Mock learning data storage
    const learning_data_storage: Array<{
      reaction: string;
      classification: string;
      timestamp: string;
    }> = [];

    // Record customer reaction 1
    const timestamp_1 = "2024-01-15T10:00:00Z";
    const reaction_1 = await recordCustomerReaction(
      {
        reaction_text: "商品説明が不十分",
        classification_key: "情報不足",
        timestamp: timestamp_1,
      },
      learning_data_storage
    );
    expect(reaction_1).toEqual({
      reaction: "商品説明が不十分",
      classification: "情報不足",
      timestamp: timestamp_1,
    });

    // Record customer reaction 2
    const timestamp_2 = "2024-01-15T10:05:00Z";
    const reaction_2 = await recordCustomerReaction(
      {
        reaction_text: "価格が高い",
        classification_key: "価格懸念",
        timestamp: timestamp_2,
      },
      learning_data_storage
    );
    expect(reaction_2).toEqual({
      reaction: "価格が高い",
      classification: "価格懸念",
      timestamp: timestamp_2,
    });

    // Record customer reaction 3
    const timestamp_3 = "2024-01-15T10:10:00Z";
    const reaction_3 = await recordCustomerReaction(
      {
        reaction_text: "納期が合わない",
        classification_key: "納期課題",
        timestamp: timestamp_3,
      },
      learning_data_storage
    );
    expect(reaction_3).toEqual({
      reaction: "納期が合わない",
      classification: "納期課題",
      timestamp: timestamp_3,
    });

    // Verify accumulated dataset
    expect(learning_data_storage).toHaveLength(3);
    expect(learning_data_storage[0]).toEqual({
      reaction: "商品説明が不十分",
      classification: "情報不足",
      timestamp: timestamp_1,
    });
    expect(learning_data_storage[1]).toEqual({
      reaction: "価格が高い",
      classification: "価格懸念",
      timestamp: timestamp_2,
    });
    expect(learning_data_storage[2]).toEqual({
      reaction: "納期が合わない",
      classification: "納期課題",
      timestamp: timestamp_3,
    });

    // Verify timestamps are in increasing order
    expect(
      new Date(learning_data_storage[0].timestamp).getTime() <
        new Date(learning_data_storage[1].timestamp).getTime()
    ).toBe(true);
    expect(
      new Date(learning_data_storage[1].timestamp).getTime() <
        new Date(learning_data_storage[2].timestamp).getTime()
    ).toBe(true);

    // Verify each record contains both classification key and reaction text
    learning_data_storage.forEach((record) => {
      expect(record.reaction).toBeDefined();
      expect(record.classification).toBeDefined();
      expect(typeof record.reaction).toBe("string");
      expect(typeof record.classification).toBe("string");
      expect(record.reaction.length).toBeGreaterThan(0);
      expect(record.classification.length).toBeGreaterThan(0);
    });
  });
});