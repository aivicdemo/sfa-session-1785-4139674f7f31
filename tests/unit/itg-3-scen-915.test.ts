import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨機能", () => {
  // SCEN-915
  test("AIエージェント正常応答時に成功する", async () => {
    // Stub: AIRecommendationEngine.generateRecommendation
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: {
          documentStructure: "営業資料の構成案：1.現状分析、2.課題認識、3.解決策提示、4.導入効果",
          initialPhaseKeyPoints: "初期接触フェーズでの重点訴求ポイント：製造業の原価低減効果、導入実績",
        },
        reasoning:
          "過去の同業種案件28件で成功。予算規模500万円超のセグメントでは提案資料の構成方法Aが有効性90%。",
        confidenceScore: 82,
      }),
    };

    // テスト用の新規案件データ
    const newDealData = {
      customerIndustry: "製造業",
      dealStage: "初期接触",
      budgetScale: 5000000,
    };

    // 推奨生成機能を実行
    const result = await generateRecommendation(newDealData, mockAIRecommendationEngine);

    // AIRecommendationEngine.generateRecommendationが1回だけ呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newDealData);

    // 推奨アプローチが存在することを確認
    expect(result.proposalApproach).toBeDefined();
    expect(result.proposalApproach.documentStructure).toContain("営業資料の構成案");
    expect(result.proposalApproach.initialPhaseKeyPoints).toContain("初期接触フェーズでの重点訴求ポイント");

    // 根拠説明が存在することを確認
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning).toContain("過去の同業種案件");
    expect(result.reasoning).toContain("有効性90%");

    // 信頼度スコアが0～100の数値であることを確認
    expect(result.confidenceScore).toBeGreaterThanOrEqual(65);
    expect(result.confidenceScore).toBeLessThanOrEqual(95);
    expect(typeof result.confidenceScore).toBe("number");
    expect(Number.isInteger(result.confidenceScore)).toBe(true);

    // システムの推奨生成ステータスが「成功」に設定されていることを確認
    expect(result.status).toBe("RECOMMENDATION_SUCCESS");
  });
});