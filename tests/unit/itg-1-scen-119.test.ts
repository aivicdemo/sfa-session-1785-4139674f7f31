import { describe, test, expect, beforeEach } from "@jest/globals";
import { determineSalesLogExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("Sales Process Log Data Extraction Range Determination - Full Department Scale", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-119
  test("should confirm extraction range with all 50 sales department members when full department is selected as target", () => {
    // Setup: Generate 50 sales representatives from sales department
    const all_sales_reps = Array.from({ length: 50 }, (_, i) => ({
      sales_rep_id: `SR${String(i + 1).padStart(4, "0")}`,
      name: `Sales Rep ${i + 1}`,
      department: "営業部",
      employee_number: `EMP${String(i + 1).padStart(5, "0")}`,
    }));

    // Input: All sales representatives selected as extraction target
    const input_params = {
      selected_sales_rep_ids: all_sales_reps.map((rep) => rep.sales_rep_id),
      extraction_period_start: "2024-01-01",
      extraction_period_end: "2024-01-31",
      available_sales_reps: all_sales_reps,
    };

    // Execute extraction range determination function
    const extraction_range_result = determineSalesLogExtractionRange(
      input_params
    );

    // Verify: Count of confirmed extraction target sales representatives equals 50
    expect(extraction_range_result.confirmed_target_count).toBe(50);

    // Verify: All 50 sales rep IDs are included without duplication
    const confirmed_ids = extraction_range_result.confirmed_sales_rep_ids;
    expect(confirmed_ids).toHaveLength(50);
    expect(new Set(confirmed_ids).size).toBe(50);

    // Verify: Each confirmed sales rep ID matches input selection exactly
    const input_id_set = new Set(input_params.selected_sales_rep_ids);
    const confirmed_id_set = new Set(confirmed_ids);
    expect(Array.from(confirmed_id_set)).toEqual(
      expect.arrayContaining(Array.from(input_id_set))
    );

    // Verify: All confirmed sales reps have department attribute set to "営業部"
    const confirmed_details = extraction_range_result.confirmed_sales_rep_details;
    expect(confirmed_details).toHaveLength(50);
    confirmed_details.forEach((detail) => {
      expect(detail.department).toBe("営業部");
    });

    // Verify: Confirmed details contain all 50 unique sales rep IDs
    const detail_ids = confirmed_details.map((d) => d.sales_rep_id);
    expect(detail_ids).toHaveLength(50);
    expect(new Set(detail_ids).size).toBe(50);

    // Verify: Extraction period is correctly stored
    expect(extraction_range_result.extraction_period_start).toBe(
      "2024-01-01"
    );
    expect(extraction_range_result.extraction_period_end).toBe("2024-01-31");

    // Verify: Result status indicates successful confirmation
    expect(extraction_range_result.status).toBe("confirmed");
  });
});