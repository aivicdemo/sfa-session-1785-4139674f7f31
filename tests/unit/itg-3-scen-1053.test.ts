import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1053
  test("推奨根拠が営業担当者向けの自然言語説明として生成される", async () => {
    // 準備: スタブの設定
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: "顧客のデジタル変革支援",
        confidence: 0.87,
        similarCaseId: "CASE-202401-045",
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "顧客の業界は製造業で、過去の成功事例では同業界の太郎物産に対して" +
          "デジタル変革による業務効率化というアプローチで成約しています。" +
          "現在の案件条件（従業員数500名、年間予算規模5000万円の投資枠）も類似しているため、" +
          "同じアプローチを推奨します。特に納期短縮と品質向上を重視する経営課題が" +
          "太郎物産の成功事例と合致しており、導入効果を明確に説明できる根拠があります。"
      ),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.87),
    };

    // 入力: 新規案件データ
    const dealData = {
      customerId: "CUST-202501-001",
      customerName: "花子工業",
      industry: "製造業",
      employeeCount: 500,
      annualBudget: 50000000,
      dealStage: "proposal",
      mainChallenge: "納期短縮と品質向上",
    };

    const recommendationData = {
      approach: "顧客のデジタル変革支援",
      confidence: 0.87,
      caseReference: "CASE-202401-045",
    };

    // 実行: explainRecommendationReasoning を呼び出し
    const explanation = await explainRecommendationReasoning(
      dealData,
      recommendationData,
      mockRecommendationEngine
    );

    // 検証: 根拠説明が営業担当者向けの自然言語で表示される

    // (1) 過去の成功事例の企業名・業界・提案内容が明記されている
    expect(explanation).toMatch(/太郎物産/);
    expect(explanation).toMatch(/製造業/);
    expect(explanation).toMatch(/デジタル変革による業務効率化/);

    // (2) 現在の案件との類似点（顧客規模、業界、予算帯など）が具体的に説明されている
    expect(explanation).toMatch(/従業員数500名/);
    expect(explanation).toMatch(/年間予算規模5000万円/);
    expect(explanation).toMatch(/類似している/);

    // (3) 「～という理由から△△のアプローチを推奨します」という提案根拠が
    //     営業活動の実務用語を使用して明確に記述されている
    expect(explanation).toMatch(/推奨します/);
    expect(explanation).toMatch(/納期短縮と品質向上/);
    expect(explanation).toMatch(/導入効果を明確に説明できる根拠/);

    // 技術用語やスコア値のみではなく、営業実務用語が使用されていることを確認
    expect(explanation).not.toMatch(/confidence/i);
    expect(explanation).not.toMatch(/embedding/i);
    expect(explanation).not.toMatch(/0\.87/);

    // 営業担当者が顧客説明に直接活用できる具体性を確認
    expect(explanation.length).toBeGreaterThan(100);
    expect(explanation).toContain("成功事例");
    expect(explanation).toContain("アプローチ");
  });
});