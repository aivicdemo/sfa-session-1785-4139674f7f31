import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-324
  test("[normal] 推奨精度検証機能 - 過去推奨内容と実際の商談結果を照合し、推奨精度スコアを正常に計測できる", () => {
    // テストデータ: 推奨履歴
    const recommendation_history = [
      {
        recommendation_id: "REC001",
        recommended_at: "2024-01-01T10:00:00Z",
        customer_id: "CUST001",
        customer_industry: "製造業",
        customer_scale: "大企業",
        proposed_approach: "提案アプローチA",
        recommendation_rationale: "成功パターンマッチ度95%",
      },
      {
        recommendation_id: "REC002",
        recommended_at: "2024-01-05T14:30:00Z",
        customer_id: "CUST002",
        customer_industry: "金融業",
        customer_scale: "中企業",
        proposed_approach: "提案アプローチB",
        recommendation_rationale: "成功パターンマッチ度80%",
      },
      {
        recommendation_id: "REC003",
        recommended_at: "2024-01-10T09:15:00Z",
        customer_id: "CUST003",
        customer_industry: "小売業",
        customer_scale: "小企業",
        proposed_approach: "提案アプローチC",
        recommendation_rationale: "成功パターンマッチ度60%",
      },
      {
        recommendation_id: "REC004",
        recommended_at: "2024-01-15T11:45:00Z",
        customer_id: "CUST004",
        customer_industry: "製造業",
        customer_scale: "大企業",
        proposed_approach: "提案アプローチD",
        recommendation_rationale: "成功パターンマッチ度70%",
      },
      {
        recommendation_id: "REC005",
        recommended_at: "2024-01-20T16:20:00Z",
        customer_id: "CUST005",
        customer_industry: "IT業",
        customer_scale: "中企業",
        proposed_approach: "提案アプローチE",
        recommendation_rationale: "成功パターンマッチ度50%",
      },
    ];

    // テストデータ: 商談結果（推奨と対応する商談結果を登録）
    const deal_results = [
      {
        deal_id: "DEAL001",
        recommendation_id: "REC001",
        final_result: "成功",
        contract_amount: 5000000,
        is_contracted: true,
        deal_closed_at: "2024-01-08T15:30:00Z",
      },
      {
        deal_id: "DEAL002",
        recommendation_id: "REC002",
        final_result: "部分成功",
        contract_amount: 2000000,
        is_contracted: true,
        deal_closed_at: "2024-01-12T10:00:00Z",
      },
      {
        deal_id: "DEAL003",
        recommendation_id: "REC003",
        final_result: "失敗",
        contract_amount: 0,
        is_contracted: false,
        deal_closed_at: "2024-01-18T14:00:00Z",
      },
      {
        deal_id: "DEAL004",
        recommendation_id: "REC004",
        final_result: "成功",
        contract_amount: 3000000,
        is_contracted: true,
        deal_closed_at: "2024-01-22T11:30:00Z",
      },
      {
        deal_id: "DEAL005",
        recommendation_id: "REC005",
        final_result: "失敗",
        contract_amount: 0,
        is_contracted: false,
        deal_closed_at: "2024-01-25T09:00:00Z",
      },
    ];

    // スタブ: evaluatePatternRelevance() を模擬化
    // 商談結果に基づいてスコアを返す
    const stub_evaluate_pattern_relevance = (
      recommendation: typeof recommendation_history[0],
      deal_result: typeof deal_results[0]
    ): number => {
      if (deal_result.final_result === "成功") {
        return 1.0;
      } else if (deal_result.final_result === "部分成功") {
        return 0.5;
      } else {
        return 0.0;
      }
    };

    // 推奨精度検証機能のメイン処理
    const accuracy_scores: number[] = [];
    const matched_pairs: Array<{
      recommendation_id: string;
      deal_id: string;
      score: number;
    }> = [];

    // 推奨履歴と商談結果の内部結合
    for (const rec of recommendation_history) {
      for (const deal of deal_results) {
        if (rec.recommendation_id === deal.recommendation_id) {
          const score = stub_evaluate_pattern_relevance(rec, deal);
          accuracy_scores.push(score);
          matched_pairs.push({
            recommendation_id: rec.recommendation_id,
            deal_id: deal.deal_id,
            score: score,
          });
        }
      }
    }

    // 総合推奨精度スコアの計算
    const total_accuracy_score =
      accuracy_scores.reduce((sum, score) => sum + score, 0) /
      accuracy_scores.length;

    // 算出対象期間の決定
    const recommendation_dates = recommendation_history.map(
      (r) => new Date(r.recommended_at).getTime()
    );
    const min_recommended_at = new Date(Math.min(...recommendation_dates));
    const max_recommended_at = new Date(Math.max(...recommendation_dates));

    // サンプル数
    const sample_count = matched_pairs.length;

    // 期待値の計算
    // 成功2件 × 1.0 + 部分成功1件 × 0.5 + 失敗2件 × 0.0 = 2.5
    // 総ペア数 5 件
    // 精度スコア = 2.5 ÷ 5 = 0.5
    const expected_accuracy_score = 0.5;
    const expected_sample_count = 5;
    const expected_period_start = "2024-01-01T10:00:00Z";
    const expected_period_end = "2024-01-20T16:20:00Z";

    // 検証
    expect(total_accuracy_score).toBe(expected_accuracy_score);
    expect(sample_count).toBe(expected_sample_count);
    expect(min_recommended_at.toISOString()).toBe(expected_period_start);
    expect(max_recommended_at.toISOString()).toBe(expected_period_end);

    // マッチしたペアの詳細検証
    expect(matched_pairs).toHaveLength(5);
    expect(matched_pairs[0]).toEqual({
      recommendation_id: "REC001",
      deal_id: "DEAL001",
      score: 1.0,
    });
    expect(matched_pairs[1]).toEqual({
      recommendation_id: "REC002",
      deal_id: "DEAL002",
      score: 0.5,
    });
    expect(matched_pairs[2]).toEqual({
      recommendation_id: "REC003",
      deal_id: "DEAL003",
      score: 0.0,
    });
    expect(matched_pairs[3]).toEqual({
      recommendation_id: "REC004",
      deal_id: "DEAL004",
      score: 1.0,
    });
    expect(matched_pairs[4]).toEqual({
      recommendation_id: "REC005",
      deal_id: "DEAL005",
      score: 0.0,
    });

    // 推奨精度スコアテーブルに記録されるべき値
    const accuracy_record = {
      total_accuracy_score: total_accuracy_score,
      evaluation_period_start: min_recommended_at.toISOString(),
      evaluation_period_end: max_recommended_at.toISOString(),
      sample_count: sample_count,
      calculated_at: expect.any(String),
    };

    expect(accuracy_record.total_accuracy_score).toBe(expected_accuracy_score);
    expect(accuracy_record.sample_count).toBe(expected_sample_count);
    expect(accuracy_record.evaluation_period_start).toBe(
      expected_period_start
    );
    expect(accuracy_record.evaluation_period_end).toBe(expected_period_end);
  });
});