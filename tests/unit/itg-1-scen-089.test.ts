import {
  determineExtractionRangeParams,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセスログ抽出範囲確定機能", () => {
  // SCEN-089
  test("同じ確定条件で2回実行しても同じ抽出範囲が確定される", () => {
    // 確定条件の設定
    const extractionCondition = {
      start_datetime: "2024-01-01T00:00:00Z",
      end_datetime: "2024-01-31T23:59:59Z",
      sales_rep_id: "USER001",
      status: "completed",
    };

    // 1回目の抽出範囲確定処理を実行
    const first_result = determineExtractionRangeParams(
      extractionCondition.start_datetime,
      extractionCondition.end_datetime,
      extractionCondition.sales_rep_id,
      extractionCondition.status
    );

    // 2回目の抽出範囲確定処理を実行（同じ確定条件で）
    const second_result = determineExtractionRangeParams(
      extractionCondition.start_datetime,
      extractionCondition.end_datetime,
      extractionCondition.sales_rep_id,
      extractionCondition.status
    );

    // 期待結果: 1回目と2回目の結果が完全に一致する
    expect(first_result.record_count).toBe(150);
    expect(first_result.extraction_range_id).toBe("RANGE-20240101-001");
    expect(first_result.start_datetime).toBe("2024-01-01T00:00:00Z");
    expect(first_result.end_datetime).toBe("2024-01-31T23:59:59Z");
    expect(first_result.sales_rep_id).toBe("USER001");
    expect(first_result.status).toBe("completed");

    expect(second_result.record_count).toBe(first_result.record_count);
    expect(second_result.extraction_range_id).toBe(
      first_result.extraction_range_id
    );
    expect(second_result.start_datetime).toBe(first_result.start_datetime);
    expect(second_result.end_datetime).toBe(first_result.end_datetime);
    expect(second_result.sales_rep_id).toBe(first_result.sales_rep_id);
    expect(second_result.status).toBe(first_result.status);

    // 完全一致を検証
    expect(second_result).toEqual(first_result);
  });
});