import { analyzeCorrelationBetweenDeviationAndOutcome } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業プロセス標準書との乖離分析と成約実績の相関分析", () => {
  // SCEN-858
  test("相関係数が-0.3～0.3の範囲内（弱い相関）の場合、correlation_strengthが「weak」と記録され、correlation_interpretationに適切なテキストが含まれること", () => {
    const testDataset = Array.from({ length: 30 }, (_, i) => ({
      sales_person_id: `SP${String(i + 1).padStart(3, "0")}`,
      process_deviation_degree: 45 + (i % 15) - 7,
      contract_amount: 100000 + i * 3000 + (i % 5) * 1000,
    }));

    const datasetId = "DS20240115001";
    const analysisTime = new Date("2024-01-15T14:30:00Z");

    const result = analyzeCorrelationBetweenDeviationAndOutcome({
      dataset: testDataset,
      dataset_id: datasetId,
      execution_timestamp: analysisTime,
    });

    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(-0.3);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(0.3);
    expect(result.correlation_strength).toBe("weak");
    expect(result.correlation_interpretation).toMatch(
      /弱い相関関係が検出されました/
    );

    const analysisTimestampMs = new Date(result.analysis_timestamp).getTime();
    const expectedTimeMs = analysisTime.getTime();
    const timeDiffMs = Math.abs(analysisTimestampMs - expectedTimeMs);
    const fiveMinutesMs = 5 * 60 * 1000;

    expect(timeDiffMs).toBeLessThanOrEqual(fiveMinutesMs);
    expect(result.source_dataset_id).toBe(datasetId);
  });
});