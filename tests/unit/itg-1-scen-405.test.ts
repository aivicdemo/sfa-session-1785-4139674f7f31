import { analyzeSuccessPatternAndGenerateReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-405: 成功パターンレコードに必須属性（パターン定義）が欠落している場合、エラーとして処理される", () => {
    // Arrange: テストデータとして、成功パターンレコードを準備
    const incompleteSuccessPattern = {
      customerSegment: "大企業",
      contactCount: 5,
      dealDurationDays: 30,
      // パターン定義属性を意図的に削除
    };

    // Act & Assert: エラーハンドリング結果をアサート
    expect(() => analyzeSuccessPatternAndGenerateReport(incompleteSuccessPattern as any)).toThrow(/パターン定義/);
  });
});