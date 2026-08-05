import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析指標自動選定機能", () => {
  // SCEN-1060
  test("営業プロセス標準書と成約実績から指標が1件のみ抽出される場合、その1件が分析対象指標リストに含まれる", () => {
    const process_indicators = [
      {
        indicator_id: "IND_A",
        indicator_name: "指標A",
        indicator_type: "contact_frequency",
      },
      {
        indicator_id: "IND_B",
        indicator_name: "指標B",
        indicator_type: "proposal_success_rate",
      },
      {
        indicator_id: "IND_C",
        indicator_name: "指標C",
        indicator_type: "followup_interval",
      },
    ];

    const sales_results = [
      {
        result_id: "RES_001",
        indicator_id: "IND_A",
        value: 12,
        period: "2024-01",
      },
      {
        result_id: "RES_002",
        indicator_id: "IND_A",
        value: 14,
        period: "2024-02",
      },
      {
        result_id: "RES_003",
        indicator_id: "IND_A",
        value: 11,
        period: "2024-03",
      },
    ];

    const analysis_indicators = selectAnalysisIndicators(
      process_indicators,
      sales_results
    );

    expect(analysis_indicators).toEqual([
      {
        indicator_id: "IND_A",
        indicator_name: "指標A",
        indicator_type: "contact_frequency",
      },
    ]);
    expect(analysis_indicators.length).toBe(1);
    expect(analysis_indicators[0].indicator_id).toBe("IND_A");
  });
});