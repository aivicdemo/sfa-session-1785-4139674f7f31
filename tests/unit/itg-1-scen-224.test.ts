import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  analyzeDeviationPatterns,
  DeviationPattern,
  DeviationAnalysisInput,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-224: [normal] 乖離パターン分析の冪等性検証
  test("同一の営業担当者の商談記録で乖離パターンを2回計算した場合、同じパターンが識別される", () => {
    const sales_rep_id = "A001";
    const deal_name = "Delta案件";
    const amount_million_yen = 5.0;
    const progress_rate = 0.3;
    const updated_date = "2024-01-15";

    const first_input: DeviationAnalysisInput = {
      sales_rep_id,
      deals: [
        {
          deal_name,
          amount_million_yen,
          progress_rate,
          updated_date,
        },
      ],
    };

    const first_result = analyzeDeviationPatterns(first_input);

    expect(first_result).toBeDefined();
    expect(Array.isArray(first_result.deviation_patterns)).toBe(true);
    expect(first_result.deviation_patterns.length).toBeGreaterThan(0);

    const first_patterns = first_result.deviation_patterns;
    const first_pattern_ids = first_patterns.map((p) => p.pattern_id);
    const first_pattern_names = first_patterns.map((p) => p.pattern_name);
    const first_deal_counts = first_patterns.map(
      (p) => p.applicable_deal_count
    );
    const first_importance_scores = first_patterns.map(
      (p) => p.importance_score
    );

    const second_input: DeviationAnalysisInput = {
      sales_rep_id,
      deals: [
        {
          deal_name,
          amount_million_yen,
          progress_rate,
          updated_date,
        },
      ],
    };

    const second_result = analyzeDeviationPatterns(second_input);

    expect(second_result).toBeDefined();
    expect(Array.isArray(second_result.deviation_patterns)).toBe(true);
    expect(second_result.deviation_patterns.length).toBe(
      first_result.deviation_patterns.length
    );

    const second_patterns = second_result.deviation_patterns;
    const second_pattern_ids = second_patterns.map((p) => p.pattern_id);
    const second_pattern_names = second_patterns.map((p) => p.pattern_name);
    const second_deal_counts = second_patterns.map(
      (p) => p.applicable_deal_count
    );
    const second_importance_scores = second_patterns.map(
      (p) => p.importance_score
    );

    expect(second_pattern_ids).toEqual(first_pattern_ids);
    expect(second_pattern_names).toEqual(first_pattern_names);
    expect(second_deal_counts).toEqual(first_deal_counts);
    expect(second_importance_scores).toEqual(first_importance_scores);

    for (let i = 0; i < first_patterns.length; i++) {
      expect(second_patterns[i].pattern_id).toBe(first_patterns[i].pattern_id);
      expect(second_patterns[i].pattern_name).toBe(
        first_patterns[i].pattern_name
      );
      expect(second_patterns[i].applicable_deal_count).toBe(
        first_patterns[i].applicable_deal_count
      );
      expect(second_patterns[i].importance_score).toBe(
        first_patterns[i].importance_score
      );
    }
  });
});