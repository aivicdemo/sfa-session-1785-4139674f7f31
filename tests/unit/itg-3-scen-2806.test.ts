import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2806
  test("推奨内容IDが欠けているとき、エラーを返す", () => {
    const undefinedResult = explainRecommendationReasoning(undefined as any);
    expect(undefinedResult).toEqual({
      error: {
        code: "RECOMMENDATION_ID_MISSING",
        status: 400,
        message: "推奨内容IDが指定されていません。根拠を表示するには有効な推奨内容IDが必須です。",
      },
    });

    const nullResult = explainRecommendationReasoning(null as any);
    expect(nullResult).toEqual({
      error: {
        code: "RECOMMENDATION_ID_MISSING",
        status: 400,
        message: "推奨内容IDが指定されていません。根拠を表示するには有効な推奨内容IDが必須です。",
      },
    });

    const emptyStringResult = explainRecommendationReasoning("");
    expect(emptyStringResult).toEqual({
      error: {
        code: "RECOMMENDATION_ID_MISSING",
        status: 400,
        message: "推奨内容IDが指定されていません。根拠を表示するには有効な推奨内容IDが必須です。",
      },
    });
  });
});