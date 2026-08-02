import { validateModifiedDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-431
  test("修正済みデータが範囲下限未満の場合、改善必要項目として該当内容を明示する", () => {
    const modified_record = {
      record_id: "REC_20240115_001",
      revenue_amount: 500,
      range_min: 1000,
      range_max: 1000000,
      field_name: "売上金額",
    };

    const result = validateModifiedDataQuality(modified_record);

    expect(result.validation_status).toBe("improvement_required");
    expect(result.improvement_items).toHaveLength(1);
    expect(result.improvement_items[0]).toEqual({
      record_id: "REC_20240115_001",
      field_name: "売上金額",
      detected_value: 500,
      range_min: 1000,
      range_max: 1000000,
      error_message: "売上金額は1000円以上である必要があります",
      status: "改善必要",
    });
  });
});