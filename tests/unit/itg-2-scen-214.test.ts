import { detectDuplicateCustomers, applyNormalizationRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-214
  test("正規化ルール適用前と適用後で同じ重複検出結果が得られる", () => {
    const customer_records_before = [
      {
        customer_id: "CUST-001",
        customer_name: "山田　太郎",
        normalized: false,
      },
      {
        customer_id: "CUST-002",
        customer_name: "山田太郎",
        normalized: false,
      },
      {
        customer_id: "CUST-003",
        customer_name: "ヤマダタロウ",
        normalized: false,
      },
    ];

    const duplicate_detection_before = detectDuplicateCustomers(
      customer_records_before
    );

    expect(duplicate_detection_before).toEqual({
      duplicate_groups: [
        {
          group_id: "DUP-001",
          customer_ids: ["CUST-001", "CUST-002", "CUST-003"],
          customer_names: ["山田　太郎", "山田太郎", "ヤマダタロウ"],
        },
      ],
      total_duplicates_detected: 3,
    });

    const customer_records_after = applyNormalizationRules(
      customer_records_before
    );

    expect(customer_records_after).toEqual([
      {
        customer_id: "CUST-001",
        customer_name: "やまだたろう",
        normalized: true,
      },
      {
        customer_id: "CUST-002",
        customer_name: "やまだたろう",
        normalized: true,
      },
      {
        customer_id: "CUST-003",
        customer_name: "やまだたろう",
        normalized: true,
      },
    ]);

    const duplicate_detection_after = detectDuplicateCustomers(
      customer_records_after
    );

    expect(duplicate_detection_after).toEqual({
      duplicate_groups: [
        {
          group_id: "DUP-001",
          customer_ids: ["CUST-001", "CUST-002", "CUST-003"],
          customer_names: ["やまだたろう", "やまだたろう", "やまだたろう"],
        },
      ],
      total_duplicates_detected: 3,
    });

    expect(duplicate_detection_before.duplicate_groups[0].group_id).toBe(
      duplicate_detection_after.duplicate_groups[0].group_id
    );
    expect(duplicate_detection_before.duplicate_groups[0].customer_ids).toEqual(
      duplicate_detection_after.duplicate_groups[0].customer_ids
    );
    expect(
      duplicate_detection_before.duplicate_groups[0].customer_ids.length
    ).toBe(3);
  });
});