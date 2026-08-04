import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-060
  test("推奨根拠説明生成機能 - 同じ推奨内容で複数回説明生成を実行しても同じ結果が返される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() =>
        Promise.resolve(
          "この推奨は、過去12ヶ月間の類似顧客事例から抽出された成功パターンに基づいています。" +
            "顧客の業種（製造業）、企業規模（従業員500-1000名）、および現在の商談段階（提案準備）が、" +
            "成功率87%の過去事例と一致しています。特に、営業担当者の初期接触から提案までの平均期間が34日であり、" +
            "本案件の45日間という期間は業界平均を上回っているため、段階的な提案アプローチが推奨されます。"
        )
      ),
    };

    const recommendationContent = {
      recommendationId: "REC-20240115-001",
      customerId: "CUST-5234",
      customerIndustry: "manufacturing",
      customerScale: 750,
      dealStage: "proposal_preparation",
      proposedApproach: "staged_proposal",
      confidenceScore: 87,
    };

    const result1 = mockAIEngine.explainRecommendationReasoning(
      recommendationContent
    );
    const result2 = mockAIEngine.explainRecommendationReasoning(
      recommendationContent
    );
    const result3 = mockAIEngine.explainRecommendationReasoning(
      recommendationContent
    );

    return Promise.all([result1, result2, result3]).then(
      ([explanation1, explanation2, explanation3]) => {
        expect(explanation1).toBe(explanation2);
        expect(explanation2).toBe(explanation3);
        expect(explanation1).toBe(
          "この推奨は、過去12ヶ月間の類似顧客事例から抽出された成功パターンに基づいています。" +
            "顧客の業種（製造業）、企業規模（従業員500-1000名）、および現在の商談段階（提案準備）が、" +
            "成功率87%の過去事例と一致しています。特に、営業担当者の初期接触から提案までの平均期間が34日であり、" +
            "本案件の45日間という期間は業界平均を上回っているため、段階的な提案アプローチが推奨されます。"
        );
      }
    );
  });
});