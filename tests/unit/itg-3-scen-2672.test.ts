import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  test("SCEN-2672: 入力成功パターンの順序が逆のとき、判定結果の順序は relevanceScore の降順で維持される", () => {
    // 入力: テスト用商談条件
    const dealCondition = {
      industry: "IT",
      budget: 5000000, // 500万円
      decisionDays: 90, // 3ヶ月
    };

    // モック成功パターンを逆順（パターンID: 3→2→1）で用意
    const mockSuccessPatterns = [
      {
        patternId: "3",
        description: "Pattern 3",
        attributes: { industry: "IT", budgetRange: "5000000+" },
      },
      {
        patternId: "2",
        description: "Pattern 2",
        attributes: { industry: "IT", budgetRange: "3000000-5000000" },
      },
      {
        patternId: "1",
        description: "Pattern 1",
        attributes: { industry: "IT", budgetRange: "1000000-3000000" },
      },
    ];

    // evaluatePatternRelevance のテスト入力
    // 各パターンに対して relevanceScore を設定
    // パターン1: 0.95, パターン2: 0.87, パターン3: 0.72
    const evaluationResults = mockSuccessPatterns.map((pattern) => {
      let relevanceScore: number;
      if (pattern.patternId === "1") {
        relevanceScore = 0.95;
      } else if (pattern.patternId === "2") {
        relevanceScore = 0.87;
      } else {
        relevanceScore = 0.72;
      }
      return {
        patternId: pattern.patternId,
        relevanceScore: relevanceScore,
        isApplicable: relevanceScore >= 0.7,
      };
    });

    // evaluatePatternRelevance を呼び出し
    const result = evaluatePatternRelevance(
      dealCondition,
      mockSuccessPatterns
    );

    // 期待結果: relevanceScore の降順（0.95→0.87→0.72）でソートされている
    // すなわちパターン順序が 1→2→3 になっていること
    expect(result).toHaveLength(3);
    expect(result[0].patternId).toBe("1");
    expect(result[0].relevanceScore).toBe(0.95);
    expect(result[1].patternId).toBe("2");
    expect(result[1].relevanceScore).toBe(0.87);
    expect(result[2].patternId).toBe("3");
    expect(result[2].relevanceScore).toBe(0.72);

    // 入力順序（3→2→1）と返却順序（1→2→3）が異なることを確認
    const inputOrder = mockSuccessPatterns.map((p) => p.patternId);
    const outputOrder = result.map((r) => r.patternId);
    expect(inputOrder).toEqual(["3", "2", "1"]);
    expect(outputOrder).toEqual(["1", "2", "3"]);
  });
});