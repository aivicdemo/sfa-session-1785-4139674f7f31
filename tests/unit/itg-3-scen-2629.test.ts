import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能 - テンプレート不正形式エラー", () => {
  // SCEN-2629
  test("不正な形式のテンプレートが入力されたときにエラーが発生する", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    // Case 1: pattern が null の不正形式
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce({
      pattern: null,
      score: 85,
    });

    expect(() => {
      evaluatePatternRelevance(
        {
          pattern: null,
          score: 85,
        },
        mockAIEngine
      );
    }).toThrow(/テンプレート形式|必須フィールド|形式が不正/);

    // Case 2: score が文字列の不正データ型
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce({
      pattern: "success_pattern_001",
      score: "invalid",
    });

    expect(() => {
      evaluatePatternRelevance(
        {
          pattern: "success_pattern_001",
          score: "invalid",
        },
        mockAIEngine
      );
    }).toThrow(/データ型|スコア|形式が不正/);

    // Case 3: 空配列の不正形式
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce([]);

    expect(() => {
      evaluatePatternRelevance([], mockAIEngine);
    }).toThrow(/テンプレート形式|必須フィールド|形式が不正/);

    // Case 4: 必須フィールド欠落（pattern フィールドなし）
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce({
      score: 75,
    });

    expect(() => {
      evaluatePatternRelevance(
        {
          score: 75,
        },
        mockAIEngine
      );
    }).toThrow(/必須フィールド|形式が不正|pattern/);

    // Case 5: 必須フィールド欠落（score フィールドなし）
    mockAIEngine.evaluatePatternRelevance.mockReturnValueOnce({
      pattern: "success_pattern_002",
    });

    expect(() => {
      evaluatePatternRelevance(
        {
          pattern: "success_pattern_002",
        },
        mockAIEngine
      );
    }).toThrow(/必須フィールド|形式が不正|スコア/);
  });
});