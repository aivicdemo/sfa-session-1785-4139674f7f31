import { describe, test, expect, beforeEach } from "@jest/globals";
import { selectBehaviorPatternAnalysisIndicators } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-782
  test("行動パターン分析対象指標の自動選定機能 - 提案成功率の閾値が51%の場合、その値が指標選定に反映される", () => {
    const process_standard_thresholds = {
      proposal_success_rate_threshold: 51,
      initial_contact_frequency_threshold: 5,
      followup_interval_threshold: 3,
    };

    const result = selectBehaviorPatternAnalysisIndicators(
      process_standard_thresholds
    );

    const proposal_success_rate_indicator = result.indicators.find(
      (indicator: { name: string; threshold: number }) =>
        indicator.name === "提案成功率"
    );

    expect(proposal_success_rate_indicator).toBeDefined();
    expect(proposal_success_rate_indicator.threshold).toBe(51);
    expect(result.indicators.length).toBeGreaterThan(0);
  });
});