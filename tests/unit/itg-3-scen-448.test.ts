import { classifyErrorsByCategory } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - エラーカテゴリ別分類機能", () => {
  // SCEN-448
  test("不整合ログが1種類のエラーカテゴリのみの場合、該当カテゴリに分類される", () => {
    const inconsistencyLog = {
      id: "log_001",
      fieldName: "customer_age",
      expectedType: "number",
      actualType: "string",
      actualValue: "thirty-five",
      createdAt: "2024-01-15T10:30:00Z",
      severity: "high" as const,
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      classifyErrorCategory: jest
        .fn()
        .mockResolvedValue({
          categories: [
            {
              categoryName: "データ型不一致",
              confidenceScore: 0.92,
              details: {
                expectedType: "number",
                actualType: "string",
              },
            },
          ],
          primaryCategory: "データ型不一致",
          secondaryCategories: [],
        }),
    };

    return classifyErrorsByCategory(inconsistencyLog, aiEngineStub).then(
      (result) => {
        expect(result.categories).toHaveLength(1);
        expect(result.categories[0].categoryName).toBe("データ型不一致");
        expect(result.categories[0].confidenceScore).toBeGreaterThanOrEqual(
          0.8
        );
        expect(result.primaryCategory).toBe("データ型不一致");
        expect(result.secondaryCategories).toHaveLength(0);
        expect(
          aiEngineStub.classifyErrorCategory
        ).toHaveBeenCalledWith(inconsistencyLog);
      }
    );
  });
});