import { describe, it, expect, beforeEach } from "@jest/globals";
import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-454
  it("複数の営業担当者について、各担当者の行動パターンスコアが個別に正常に算出される", () => {
    // テストデータ: 営業担当者A、B、Cの行動ログ
    const salesPersonA = {
      sales_person_id: "A001",
      sales_person_name: "営業担当者A",
      visit_count: 10,
      proposal_count: 8,
      contract_count: 5,
      followup_delay_days: 2,
    };

    const salesPersonB = {
      sales_person_id: "B001",
      sales_person_name: "営業担当者B",
      visit_count: 12,
      proposal_count: 9,
      contract_count: 4,
      followup_delay_days: 5,
    };

    const salesPersonC = {
      sales_person_id: "C001",
      sales_person_name: "営業担当者C",
      visit_count: 15,
      proposal_count: 11,
      contract_count: 6,
      followup_delay_days: 1,
    };

    const analysisInput = {
      target_period: "2024-01",
      target_sales_persons: [salesPersonA, salesPersonB, salesPersonC],
    };

    // 行動パターン分析レポート生成機能を実行
    const report = generateBehaviorPatternAnalysisReport(analysisInput);

    // 営業担当者Aのスコア計算: 訪問件数×0.3 + 提案件数×0.4 + 成約件数×0.5 - フォローアップ遅延日数×0.1
    // = 10×0.3 + 8×0.4 + 5×0.5 - 2×0.1
    // = 3 + 3.2 + 2.5 - 0.2
    // = 8.5
    const expectedScoreA = 10 * 0.3 + 8 * 0.4 + 5 * 0.5 - 2 * 0.1;

    // 営業担当者Bのスコア計算: 訪問件数×0.3 + 提案件数×0.4 + 成約件数×0.5 - フォローアップ遅延日数×0.1
    // = 12×0.3 + 9×0.4 + 4×0.5 - 5×0.1
    // = 3.6 + 3.6 + 2 - 0.5
    // = 8.7
    const expectedScoreB = 12 * 0.3 + 9 * 0.4 + 4 * 0.5 - 5 * 0.1;

    // 営業担当者Cのスコア計算: 訪問件数×0.3 + 提案件数×0.4 + 成約件数×0.5 - フォローアップ遅延日数×0.1
    // = 15×0.3 + 11×0.4 + 6×0.5 - 1×0.1
    // = 4.5 + 4.4 + 3 - 0.1
    // = 11.8
    const expectedScoreC = 15 * 0.3 + 11 * 0.4 + 6 * 0.5 - 1 * 0.1;

    // レポートから各営業担当者のスコアを抽出
    const scoreA = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string; score: number }) =>
        item.sales_person_id === "A001"
    )?.score;
    const scoreB = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string; score: number }) =>
        item.sales_person_id === "B001"
    )?.score;
    const scoreC = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string; score: number }) =>
        item.sales_person_id === "C001"
    )?.score;

    // 各スコア値が独立して計算されていることを確認（互いに異なる値であること）
    expect(scoreA).not.toBe(scoreB);
    expect(scoreB).not.toBe(scoreC);
    expect(scoreA).not.toBe(scoreC);

    // 営業担当者Aのスコア計算式に基づき、期待値と実際の値が一致することを検証
    expect(scoreA).toBeCloseTo(expectedScoreA, 5);
    expect(scoreB).toBeCloseTo(expectedScoreB, 5);
    expect(scoreC).toBeCloseTo(expectedScoreC, 5);

    // レポート構造の検証
    expect(report).toHaveProperty("target_period");
    expect(report.target_period).toBe("2024-01");
    expect(report).toHaveProperty("behavior_pattern_scores");
    expect(Array.isArray(report.behavior_pattern_scores)).toBe(true);
    expect(report.behavior_pattern_scores.length).toBe(3);

    // 各営業担当者のスコア情報が含まれていることを検証
    const scoreRecordA = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string }) => item.sales_person_id === "A001"
    );
    const scoreRecordB = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string }) => item.sales_person_id === "B001"
    );
    const scoreRecordC = report.behavior_pattern_scores.find(
      (item: { sales_person_id: string }) => item.sales_person_id === "C001"
    );

    expect(scoreRecordA).toBeDefined();
    expect(scoreRecordB).toBeDefined();
    expect(scoreRecordC).toBeDefined();

    expect(scoreRecordA).toHaveProperty("sales_person_name");
    expect(scoreRecordA.sales_person_name).toBe("営業担当者A");
    expect(scoreRecordB.sales_person_name).toBe("営業担当者B");
    expect(scoreRecordC.sales_person_name).toBe("営業担当者C");
  });
});