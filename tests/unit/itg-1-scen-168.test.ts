import { mapProcessDataItems } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-168
  test("標準書に1個のデータ項目が列挙されている場合、1個のシステムデータ項目に正しく変換される", () => {
    const process_definition_id = "proc_def_001";
    const standard_book_items = [
      {
        item_name: "顧客ID",
        item_type: "string",
        is_required: true,
        description: "顧客を一意に識別する識別子",
      },
    ];

    const result = mapProcessDataItems({
      process_definition_id,
      standard_book_items,
    });

    expect(result.mapping_results).toHaveLength(1);
    expect(result.mapping_results[0]).toEqual({
      standard_item_name: "顧客ID",
      system_item_name: "customer_id",
      system_item_type: "VARCHAR(20)",
      mapping_status: "mapped",
    });
    expect(result.overall_status).toBe("completed");
    expect(result.mapped_count).toBe(1);
    expect(result.unmapped_count).toBe(0);
  });
});