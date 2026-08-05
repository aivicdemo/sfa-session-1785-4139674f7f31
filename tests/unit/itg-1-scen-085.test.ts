import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
  confirmSalesProcessLogExtractionRange,
  type ConfirmSalesProcessLogExtractionRangeInput,
  type ConfirmSalesProcessLogExtractionRangeOutput,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-085
  it("should confirm extraction range with 0 target sales representatives and record completion details", () => {
    const input: ConfirmSalesProcessLogExtractionRangeInput = {
      logged_in_user_id: "user_001",
      logged_in_user_role: "sales_director",
      department: "sales",
      status_filter: "all",
      target_sales_rep_ids: [],
      confirmation_timestamp: new Date("2024-01-15T09:30:00Z"),
    };

    const result: ConfirmSalesProcessLogExtractionRangeOutput =
      confirmSalesProcessLogExtractionRange(input);

    expect(result.status).toBe("confirmed");
    expect(result.target_count).toBe(0);
    expect(result.extraction_range_state).toBe("confirmed_zero_targets");
    expect(result.confirmed_at).toEqual(new Date("2024-01-15T09:30:00Z"));
    expect(result.confirmed_by_user_id).toBe("user_001");
    expect(result.confirmed_by_user_role).toBe("sales_director");
    expect(result.extraction_range_record_id).toBeDefined();
    expect(typeof result.extraction_range_record_id).toBe("string");
    expect(result.extraction_range_record_id.length).toBeGreaterThan(0);
  });
});