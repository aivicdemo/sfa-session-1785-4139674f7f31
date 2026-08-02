import {
  validateSalesData,
} from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-415: [normal] 営業データ品質検証エンジン - 業務上の最大規模顧客データ（10000件）の検証が実行される
  test("10000件の顧客データの検証が60秒以内に完了し、カテゴリ別エラー数を含むレポートを返却する", async () => {
    const recordCount = 10000;
    const formatErrorCount = 45;
    const dataTypeErrorCount = 28;
    const requiredFieldMissingCount = 12;
    const totalErrorCount =
      formatErrorCount + dataTypeErrorCount + requiredFieldMissingCount;

    const executionStartTime = new Date("2024-01-15T09:00:00Z");
    const executionEndTime = new Date("2024-01-15T09:00:45Z");
    const executionTimeSeconds = 45;

    const inputData = {
      recordCount: recordCount,
      dataSourcePath: "file:///data/customer_master_2024_01.csv",
      executionStartTime: executionStartTime,
    };

    const validationResult = await validateSalesData(inputData);

    expect(validationResult.processedRecordCount).toBe(10000);
    expect(validationResult.errorsByCategory.formatErrors).toBe(
      formatErrorCount
    );
    expect(validationResult.errorsByCategory.dataTypeErrors).toBe(
      dataTypeErrorCount
    );
    expect(validationResult.errorsByCategory.requiredFieldMissing).toBe(
      requiredFieldMissingCount
    );
    expect(validationResult.totalErrorCount).toBe(totalErrorCount);
    expect(validationResult.executionStartTime).toEqual(executionStartTime);
    expect(validationResult.executionEndTime).toEqual(executionEndTime);
    expect(validationResult.executionTimeSeconds).toBeLessThanOrEqual(60);
    expect(validationResult.executionTimeSeconds).toBe(executionTimeSeconds);
    expect(validationResult.validationStatus).toBe("完了");
    expect(validationResult.report).toBeDefined();
    expect(validationResult.report.recordCount).toBe(10000);
    expect(validationResult.report.errorCount).toBe(totalErrorCount);
    expect(validationResult.report.successCount).toBe(
      10000 - totalErrorCount
    );
  });
});