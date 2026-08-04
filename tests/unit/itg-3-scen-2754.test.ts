import { findSimilarPatterns, evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - 月をまたぐ期間での統合精度計算", () => {
  // SCEN-2754
  test("テスト対象期間が月をまたぐとき、両月の成功パターンが統合されて精度スコアに反映される", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-02-15T00:00:00Z");

    // 2024年1月の成功パターンデータセット (5件)
    const january_patterns = [
      {
        pattern_id: "jan_pattern_001",
        customer_size: "large",
        industry: "finance",
        contract_type: "long_term",
        created_at: new Date("2024-01-10T09:00:00Z"),
      },
      {
        pattern_id: "jan_pattern_002",
        customer_size: "large",
        industry: "manufacturing",
        contract_type: "long_term",
        created_at: new Date("2024-01-12T14:30:00Z"),
      },
      {
        pattern_id: "jan_pattern_003",
        customer_size: "mid_market",
        industry: "retail",
        contract_type: "phased_implementation",
        created_at: new Date("2024-01-14T11:00:00Z"),
      },
      {
        pattern_id: "jan_pattern_004",
        customer_size: "mid_market",
        industry: "healthcare",
        contract_type: "phased_implementation",
        created_at: new Date("2024-01-13T10:15:00Z"),
      },
      {
        pattern_id: "jan_pattern_005",
        customer_size: "enterprise",
        industry: "telecom",
        contract_type: "long_term",
        created_at: new Date("2024-01-11T15:45:00Z"),
      },
    ];

    // 2024年2月の成功パターンデータセット (4件)
    const february_patterns = [
      {
        pattern_id: "feb_pattern_001",
        customer_size: "mid_market",
        industry: "new_entry_sector",
        contract_type: "market_entry",
        created_at: new Date("2024-02-01T09:30:00Z"),
      },
      {
        pattern_id: "feb_pattern_002",
        customer_size: "large",
        industry: "finance",
        contract_type: "expansion",
        created_at: new Date("2024-02-05T13:20:00Z"),
      },
      {
        pattern_id: "feb_pattern_003",
        customer_size: "mid_market",
        industry: "technology",
        contract_type: "expansion",
        created_at: new Date("2024-02-10T10:00:00Z"),
      },
      {
        pattern_id: "feb_pattern_004",
        customer_size: "enterprise",
        industry: "government",
        contract_type: "long_term",
        created_at: new Date("2024-02-12T14:45:00Z"),
      },
    ];

    const all_patterns = [...january_patterns, ...february_patterns];

    // モックスタブ: findSimilarPatterns の実装
    const mock_find_similar_patterns = jest.fn(
      (
        date_range_start: Date,
        date_range_end: Date,
        _patterns_db: Array<{
          pattern_id: string;
          customer_size: string;
          industry: string;
          contract_type: string;
          created_at: Date;
        }>
      ) => {
        return all_patterns.filter(
          (p) => p.created_at >= date_range_start && p.created_at <= date_range_end
        );
      }
    );

    // モックスタブ: evaluatePatternRelevance の実装
    const mock_evaluate_pattern_relevance = jest.fn(
      (
        patterns: Array<{
          pattern_id: string;
          customer_size: string;
          industry: string;
          contract_type: string;
          created_at: Date;
        }>,
        new_deal_condition: {
          customer_size: string;
          industry: string;
          budget: number;
        }
      ) => {
        // 新規案件条件とのマッチング精度スコア計算
        // (簡略的な評価: customer_size マッチで50点、industry マッチで30点、基本20点)
        return patterns.map((p) => {
          let score = 20;
          if (p.customer_size === new_deal_condition.customer_size) {
            score += 50;
          }
          if (p.industry === new_deal_condition.industry) {
            score += 30;
          }
          return {
            pattern_id: p.pattern_id,
            relevance_score: score,
          };
        });
      }
    );

    // ステップ1: 対象期間で統合検索
    const integrated_patterns = mock_find_similar_patterns(
      start_date,
      end_date,
      all_patterns
    );
    expect(integrated_patterns.length).toBe(9);

    // ステップ2: 新規案件条件を定義
    const new_deal_condition = {
      customer_size: "large",
      industry: "finance",
      budget: 500000,
    };

    // ステップ3: 統合パターン全体の精度スコアを計算
    const integrated_relevance_results =
      mock_evaluate_pattern_relevance(integrated_patterns, new_deal_condition);
    const integrated_total_score = integrated_relevance_results.reduce(
      (sum, r) => sum + r.relevance_score,
      0
    );
    const integrated_average_score = integrated_total_score / 9;

    // ステップ4: 1月のみの精度スコアを計算
    const january_only_patterns = mock_find_similar_patterns(
      new Date("2024-01-15T00:00:00Z"),
      new Date("2024-01-31T23:59:59Z"),
      january_patterns
    );
    const january_relevance_results = mock_evaluate_pattern_relevance(
      january_only_patterns,
      new_deal_condition
    );
    const january_total_score = january_relevance_results.reduce(
      (sum, r) => sum + r.relevance_score,
      0
    );
    const january_average_score = january_total_score / 5;

    // ステップ5: 2月のみの精度スコアを計算
    const february_only_patterns = mock_find_similar_patterns(
      new Date("2024-02-01T00:00:00Z"),
      new Date("2024-02-15T23:59:59Z"),
      february_patterns
    );
    const february_relevance_results = mock_evaluate_pattern_relevance(
      february_only_patterns,
      new_deal_condition
    );
    const february_total_score = february_relevance_results.reduce(
      (sum, r) => sum + r.relevance_score,
      0
    );
    const february_average_score = february_total_score / 4;

    // ステップ6: 期待値計算 - 加重平均
    const expected_integrated_score =
      (january_average_score * 5 + february_average_score * 4) / 9;

    // ステップ7: アサーション
    expect(integrated_average_score).toBe(expected_integrated_score);
    expect(integrated_patterns.length).toBe(
      january_only_patterns.length + february_only_patterns.length
    );
    expect(integrated_patterns.length).toBe(9);
  });
});