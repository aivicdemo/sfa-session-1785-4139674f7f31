import { classifyErrorsByCategory } from "../../src/logic/itg-3";

describe("Error Category Classification", () => {
  test("SCEN-449: Multiple error categories in inconsistency log are correctly classified", () => {
    const inconsistencyLogText =
      "API response timeout occurred at 2024-01-15T10:30:00Z. Database connection error detected. Authentication token invalid for user session.";

    const classificationResult = classifyErrorsByCategory(inconsistencyLogText);

    expect(classificationResult).toEqual({
      categories: [
        "APIレスポンスタイムアウト",
        "データベース接続エラー",
        "認証トークン無効",
      ],
      categoryCounts: {
        APIレスポンスタイムアウト: 1,
        データベース接続エラー: 1,
        認証トークン無効: 1,
      },
      totalUniqueCategories: 3,
    });

    expect(classificationResult.categories).toHaveLength(3);
    expect(classificationResult.totalUniqueCategories).toBe(3);
    expect(
      classificationResult.categories.includes("APIレスポンスタイムアウト")
    ).toBe(true);
    expect(
      classificationResult.categories.includes("データベース接続エラー")
    ).toBe(true);
    expect(
      classificationResult.categories.includes("認証トークン無効")
    ).toBe(true);
  });
});