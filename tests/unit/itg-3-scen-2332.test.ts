import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - OpenAI APIタイムアウト時の代替処理", () => {
  // SCEN-2332
  test("OpenAI API呼び出しがタイムアウトのとき内部推奨パターンマスタから統計上位パターンが返却される", async () => {
    // Arrange: AIRecommendationEngine のスタブを構成
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockImplementation(async () => {
        // 30秒のタイムアウトをシミュレート
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("Request timeout: API call exceeded 30 seconds"));
          }, 50); // テスト実行時間を短縮するため50msで即座にタイムアウト
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 入力パラメータ: 新規案件の顧客・商談条件
    const input = {
      customerIndustry: "IT",
      budget: 5000000, // 500万円
      decisionMakerCount: 3,
      aiEngine: aiEngineStub,
    };

    // Act: generateRecommendation() を実行
    const result = await generateRecommendation(input);

    // Assert: 返却されたパターンが要件を満たしていることを確認

    // (1) パターンは過去成功率の高い順にソート（上位3件程度）
    expect(result.patterns).toBeDefined();
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBeLessThanOrEqual(3);

    // 各パターンが成功率でソートされていることを確認
    for (let i = 0; i < result.patterns.length - 1; i++) {
      expect(result.patterns[i].successRate).toBeGreaterThanOrEqual(
        result.patterns[i + 1].successRate
      );
    }

    // 成功率が80%以上であることを確認
    result.patterns.forEach((pattern) => {
      expect(pattern.successRate).toBeGreaterThanOrEqual(0.8);
    });

    // (2) 各パターンに簡略版の根拠説明を付与
    result.patterns.forEach((pattern) => {
      expect(pattern.briefExplanation).toBeDefined();
      expect(typeof pattern.briefExplanation).toBe("string");
      expect(pattern.briefExplanation.length).toBeGreaterThan(0);
      // 簡略版であることを確認（例：パターン名と適用理由のみ）
      expect(pattern.briefExplanation.length).toBeLessThan(200);
    });

    // (3) meta.sourceが「internal_master」で設定されていることを確認
    expect(result.meta).toBeDefined();
    expect(result.meta.source).toBe("internal_master");

    // (4) meta.reasonにタイムアウト時の代替動作を示すメッセージを含むことを確認
    expect(result.meta.reason).toBeDefined();
    expect(typeof result.meta.reason).toBe("string");
    expect(result.meta.reason).toMatch(
      /AIサービスが一時的に利用できないため|タイムアウト|代替/
    );

    // (5) エラースロー（例外送出）は発生しないことを確認
    // この test() は正常に完了し、例外が発生していないことで検証
    expect(result).toBeDefined();
  });
});