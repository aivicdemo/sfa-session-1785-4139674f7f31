import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2828: 推奨根拠の説明文長がちょうど500文字のとき、省略フラグなしで返却される", () => {
    const dealId = "DEAL-001";
    const customerId = "CUST-001";
    
    // ちょうど500文字の説明文を生成
    const explanationTextExactly500 = "A".repeat(500);
    
    // AIRecommendationEngineのスタブ化
    const stubAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanationText: explanationTextExactly500,
        isTruncated: false
      })
    };
    
    // 推奨根拠の可視化・説明文生成機能を実行
    const result = explainRecommendationReasoning(
      dealId,
      customerId,
      stubAIEngine
    );
    
    // 説明文の文字数を計測
    const textLength = result.explanationText.length;
    
    // 期待結果を検証
    expect(textLength).toBe(500);
    expect(result.isTruncated).toBe(false);
    expect(result.explanationText).not.toContain("...");
  });
});