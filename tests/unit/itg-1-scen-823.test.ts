import { analyzeSalesPersonBehaviorPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-823: 既存の行動パターン分析結果を再分析により上書きする", () => {
    // Arrange: 既存の行動パターン分析結果を準備
    const salesPersonId = "SA001";
    const existingAnalysisResult = {
      sales_person_id: salesPersonId,
      analysis_datetime: "2024-01-10T10:00:00Z",
      pattern_classification: "積極型",
      contact_frequency: "週3回",
    };

    const input = {
      sales_person_id: salesPersonId,
      new_analysis_datetime: "2024-01-15T14:30:00Z",
      new_pattern_classification: "慎重型",
      new_contact_frequency: "週2回",
      existing_records: [existingAnalysisResult],
    };

    // Act: 行動パターン再分析を実行
    const result = analyzeSalesPersonBehaviorPattern(input);

    // Assert: 分析結果テーブルのレコード数が1件であることを確認
    expect(result.total_records).toBe(1);

    // Assert: 既存レコードが削除され、新しい分析結果に上書きされていることを確認
    expect(result.analysis_records).toHaveLength(1);
    expect(result.analysis_records[0].sales_person_id).toBe(salesPersonId);
    expect(result.analysis_records[0].analysis_datetime).toBe(
      "2024-01-15T14:30:00Z"
    );
    expect(result.analysis_records[0].pattern_classification).toBe("慎重型");
    expect(result.analysis_records[0].contact_frequency).toBe("週2回");

    // Assert: 既存レコードの分析日時が削除されていることを確認
    expect(
      result.analysis_records.some(
        (record) => record.analysis_datetime === "2024-01-10T10:00:00Z"
      )
    ).toBe(false);
  });
});