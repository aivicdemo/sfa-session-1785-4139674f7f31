import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案内容と顧客対応パターンの標準プロセス照合分析", () => {
  test("SCEN-2085: 複数の顧客対応パターンレコードが同じ提案に対して降順に並んでいるとき、全件の合致スコアが計算される", () => {
    // 準備: 同じ提案IDに紐づく3件の顧客対応パターンレコード（降順）
    const proposalId = "PROP-2025-001";
    const proposalContent =
      "顧客のデジタル変革支援サービス提案";

    const customerPatternRecords = [
      {
        proposal_id: proposalId,
        created_at: "2025-01-15T00:00:00Z",
        customer_industry: "金融",
        budget_scale: "大",
        pattern_order: 1,
      },
      {
        proposal_id: proposalId,
        created_at: "2025-01-10T00:00:00Z",
        customer_industry: "小売",
        budget_scale: "中",
        pattern_order: 2,
      },
      {
        proposal_id: proposalId,
        created_at: "2025-01-05T00:00:00Z",
        customer_industry: "製造",
        budget_scale: "小",
        pattern_order: 3,
      },
    ];

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((record: any) => {
        if (
          record.created_at === "2025-01-15T00:00:00Z" &&
          record.customer_industry === "金融" &&
          record.budget_scale === "大"
        ) {
          return 0.92;
        }
        if (
          record.created_at === "2025-01-10T00:00:00Z" &&
          record.customer_industry === "小売" &&
          record.budget_scale === "中"
        ) {
          return 0.78;
        }
        if (
          record.created_at === "2025-01-05T00:00:00Z" &&
          record.customer_industry === "製造" &&
          record.budget_scale === "小"
        ) {
          return 0.65;
        }
        return 0.0;
      }),
    };

    // 実行: 提案分析機能を実行
    const result = evaluatePatternRelevance(
      {
        proposal_id: proposalId,
        proposal_content: proposalContent,
        customer_patterns: customerPatternRecords,
      },
      mockAIEngine
    );

    // 検証: 全件の合致スコアが計算され、降順の順序が保持されていること
    expect(result.pattern_scores).toHaveLength(3);
    expect(result.pattern_scores[0].pattern_order).toBe(1);
    expect(result.pattern_scores[0].relevance_score).toBe(0.92);
    expect(result.pattern_scores[1].pattern_order).toBe(2);
    expect(result.pattern_scores[1].relevance_score).toBe(0.78);
    expect(result.pattern_scores[2].pattern_order).toBe(3);
    expect(result.pattern_scores[2].relevance_score).toBe(0.65);

    // スコア計算の漏落がないことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // 降順の元の順序が保持されていることを確認
    expect(result.pattern_scores.map((s: any) => s.created_at)).toEqual([
      "2025-01-15T00:00:00Z",
      "2025-01-10T00:00:00Z",
      "2025-01-05T00:00:00Z",
    ]);
  });
});