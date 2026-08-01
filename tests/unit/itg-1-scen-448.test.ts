import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

import { analyzeAnomaliesInSalesPerformance } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test("SCEN-448: [normal] 異常パターンが検出される場合、異常の内容と詳細が可視化される", async () => {
    const sales_rep_id = "SR001";
    const analysis_period_start = "2024-01-01";
    const analysis_period_end = "2024-12-31";
    const detected_anomaly_timestamp = "2025-01-15T10:30:00Z";

    const mock_response = {
      sales_rep_id: sales_rep_id,
      analysis_period: {
        start: analysis_period_start,
        end: analysis_period_end,
      },
      anomalies: [
        {
          anomaly_id: "ANM001",
          abnormal_flag: true,
          abnormal_type: "unusually_low_contact_frequency",
          display_label_ja: "月間接触回数が基準値を大きく下回っています",
          detail: {
            current_value: 5,
            threshold_value: 20,
            period_unit: "monthly",
            unit_label: "件/月",
          },
          detection_timestamp: detected_anomaly_timestamp,
        },
      ],
      report_generated_at: "2025-01-15T10:30:00Z",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_response), { status: 200 });

    const result = await analyzeAnomaliesInSalesPerformance({
      sales_rep_id: sales_rep_id,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
    });

    expect(result).toBeDefined();
    expect(result.sales_rep_id).toBe(sales_rep_id);

    expect(result.anomalies).toBeDefined();
    expect(result.anomalies.length).toBe(1);

    const detected_anomaly = result.anomalies[0];
    expect(detected_anomaly.abnormal_flag).toBe(true);
    expect(detected_anomaly.abnormal_type).toBe(
      "unusually_low_contact_frequency"
    );
    expect(detected_anomaly.display_label_ja).toBe(
      "月間接触回数が基準値を大きく下回っています"
    );

    expect(detected_anomaly.detail).toBeDefined();
    expect(detected_anomaly.detail.current_value).toBe(5);
    expect(detected_anomaly.detail.threshold_value).toBe(20);
    expect(detected_anomaly.detail.period_unit).toBe("monthly");
    expect(detected_anomaly.detail.unit_label).toBe("件/月");

    expect(detected_anomaly.detection_timestamp).toBe(detected_anomaly_timestamp);
    const timestamp_date = new Date(detected_anomaly.detection_timestamp);
    expect(timestamp_date.toISOString()).toBe(detected_anomaly_timestamp);
  });
});