import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2236: 推奨根拠説明生成機能 - OpenAI API呼び出しが失敗したとき簡略版の根拠説明が返却される", async () => {
    // OpenAI API呼び出し失敗をモック化（503 Service Unavailable）
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error("Service Unavailable")
      ),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタに統計的に上位の成功パターン（TOP-001、TOP-002、TOP-003）が事前登録されていることを確認
    const topSuccessPatterns = [
      {
        patternId: "TOP-001",
        customerIndustry: "製造業",
        budgetScale: 5000000,
        decisionProcess: "稟議制度",
        successRate: 0.85,
        patternName: "製造業・稟議決定型・大規模投資",
        approachSummary: "経営層への説得資料重視、ROI強調",
      },
      {
        patternId: "TOP-002",
        customerIndustry: "製造業",
        budgetScale: 5000000,
        decisionProcess: "稟議制度",
        successRate: 0.78,
        patternName: "製造業・効率改善型",
        approachSummary: "現場課題のヒアリング、改善効果の数値化",
      },
      {
        patternId: "TOP-003",
        customerIndustry: "製造業",
        budgetScale: 5000000,
        decisionProcess: "稟議制度",
        successRate: 0.72,
        patternName: "製造業・段階的導入型",
        approachSummary: "パイロット導入、段階的スケールアップ",
      },
    ];

    // 新規案件の顧客・商談条件を入力
    const dealCondition = {
      customerIndustry: "製造業",
      budgetScale: 5000000,
      decisionProcess: "稟議制度",
      dealId: "DEAL-2024-001",
      customerId: "CUST-2024-001",
    };

    // generateRecommendationメソッドを呼び出す
    const result = await generateRecommendation(
      dealCondition,
      mockAIRecommendationEngine,
      topSuccessPatterns
    );

    // 推奨内容が返却されることを確認
    expect(result).toBeDefined();

    // (1) 根拠説明に『推奨パターンマスタから統計的に上位の成功パターン』の情報が含まれる
    expect(result.reasoningExplanation).toContain("推奨パターンマスタ");
    expect(result.reasoningExplanation).toContain("TOP-001");

    // (2) 根拠説明に『API呼び出し失敗に伴う簡略版表示の旨』が記載されている
    expect(result.reasoningExplanation).toMatch(
      /API.*失敗|一時的.*遅延|簡略版/
    );

    // (3) 返却されるパターンは推奨パターンマスタの統計的上位3件のいずれか
    // で、生成AIによる自然言語説明ではなく定型テンプレートで構成されている
    const returnedPatternIds = result.recommendedPatterns.map(
      (p: { patternId: string }) => p.patternId
    );
    expect(["TOP-001", "TOP-002", "TOP-003"]).toEqual(
      expect.arrayContaining(returnedPatternIds)
    );
    expect(result.recommendedPatterns[0]).toHaveProperty("patternName");
    expect(result.recommendedPatterns[0]).toHaveProperty("approachSummary");

    // (4) レスポンスのstatusフィールドが『success_with_fallback』で、
    // isSimplifiedReasoningフラグが『true』である
    expect(result.status).toBe("success_with_fallback");
    expect(result.isSimplifiedReasoning).toBe(true);
  });
});