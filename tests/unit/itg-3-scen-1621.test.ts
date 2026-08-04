import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1621
  test("推奨内容の根拠表示 - 根拠の説明文が空のとき、デフォルトメッセージが表示される", () => {
    const recommendationId = "rec-12345";
    const recommendationContent = "既存顧客へのアップセル提案を推奨します";
    const recommendationScore = 85;
    const emptyReasoning = "";

    const result = explainRecommendationReasoning({
      recommendationId: recommendationId,
      recommendationContent: recommendationContent,
      recommendationScore: recommendationScore,
      reasoning: emptyReasoning,
    });

    expect(result).toEqual({
      recommendationId: recommendationId,
      recommendationContent: recommendationContent,
      recommendationScore: recommendationScore,
      displayReasoning: "根拠情報は現在利用できません。営業担当者にお問い合わせください。",
      isDefaultMessage: true,
    });
  });
});