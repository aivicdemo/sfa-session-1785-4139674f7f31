import { determineExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-087
  test("営業部長により複数営業担当者の抽出範囲が確定され、全営業担当者が同一情報を共有できること", () => {
    const extraction_range_input = {
      initiated_by_user_id: "user_001",
      initiated_by_user_role: "営業部長",
      target_sales_rep_ids: ["rep_001", "rep_002", "rep_003"],
      extraction_start_date: "2024-01-01",
      extraction_end_date: "2024-01-31",
      target_process_names: ["提案作成", "見積提出", "受注"],
    };

    const result = determineExtractionRange(extraction_range_input);

    expect(result.is_confirmed).toBe(true);
    expect(result.confirmed_by_user_id).toBe("user_001");
    expect(result.confirmed_by_user_role).toBe("営業部長");
    expect(result.target_sales_rep_ids).toEqual([
      "rep_001",
      "rep_002",
      "rep_003",
    ]);
    expect(result.target_sales_rep_ids.length).toBe(3);
    expect(result.extraction_start_date).toBe("2024-01-01");
    expect(result.extraction_end_date).toBe("2024-01-31");
    expect(result.target_process_names).toEqual([
      "提案作成",
      "見積提出",
      "受注",
    ]);
    expect(result.target_process_names.length).toBe(3);
    expect(typeof result.confirmed_at).toBe("string");
    expect(result.status).toBe("確定");
    expect(result.shared_with_sales_reps).toEqual([
      "rep_001",
      "rep_002",
      "rep_003",
    ]);
  });
});