import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - AIRecommendationEngine呼び出し失敗時の代替推奨", () => {
  test("SCEN-569: AIRecommendationEngine呼び出しが失敗するとき内部推奨パターンマスタから代替推奨が返される", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error("API call failed")
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseConditions = {
      customer_industry: "IT",
      customer_company_size: 500,
      deal_type: "新規案件",
      budget_range_min: 10000000,
      budget_range_max: 50000000,
      sales_cycle_days: 90,
    };

    const mockInternalPatterns = [
      {
        pattern_id: "PAT-001",
        success_rate: 0.92,
        industry: "IT",
        deal_type: "新規案件",
        recommended_approach:
          "経営層へのアプローチから開始し、技術部門との詳細検討を並行実施",
        brief_rationale: "IT企業の新規案件では経営層とのアライメントが成功の鍵",
        rank: 1,
      },
      {
        pattern_id: "PAT-002",
        success_rate: 0.88,
        industry: "IT",
        deal_type: "新規案件",
        recommended_approach:
          "RFP段階から提案資料を厳密に準備し、複数回の提案活動を計画",
        brief_rationale: "IT業界では詳細な技術仕様説明が重視される傾向",
        rank: 2,
      },
      {
        pattern_id: "PAT-003",
        success_rate: 0.85,
        industry: "IT",
        deal_type: "新規案件",
        recommended_approach: "導入後の運用支援体制の提示を早期に行う",
        brief_rationale: "運用不安の払拭が購買決定を加速させる",
        rank: 3,
      },
    ];

    const result = await generateRecommendation(
      newCaseConditions,
      mockRecommendationEngine,
      mockInternalPatterns
    );

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
      3
    );

    expect(result).toEqual({
      recommendation_id: expect.any(String),
      recommended_pattern_id: "PAT-001",
      recommended_approach:
        "経営層へのアプローチから開始し、技術部門との詳細検討を並行実施",
      success_rate: 0.92,
      reasoning_type: "brief",
      brief_rationale: "IT企業の新規案件では経営層とのアライメントが成功の鍵",
      user_message:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      fallback_used: true,
      source: "internal_pattern_master",
    });

    expect(result.fallback_used).toBe(true);
    expect(result.source).toBe("internal_pattern_master");
    expect(result.success_rate).toBe(0.92);
    expect(result.recommended_pattern_id).toBe("PAT-001");
    expect(result.brief_rationale).toBe(
      "IT企業の新規案件では経営層とのアライメントが成功の鍵"
    );
    expect(result.user_message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
  });
});