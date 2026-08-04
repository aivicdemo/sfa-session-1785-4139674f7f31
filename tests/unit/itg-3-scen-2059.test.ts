import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件への提案アプローチ推奨", () => {
  test("SCEN-2059: 適合性スコアが同一の場合、セカンダリソート条件で順序が決定される", () => {
    // Arrange: 適合性スコアが同一の成功パターン候補を準備
    const mockPatternA = {
      patternId: "pat_001",
      relevanceScore: 0.85,
      lastSuccessDate: new Date("2024-06-15T00:00:00Z"),
      successCaseCount: 12,
      patternName: "Pattern A",
      approach: "Approach A"
    };

    const mockPatternB = {
      patternId: "pat_002",
      relevanceScore: 0.85,
      lastSuccessDate: new Date("2024-05-10T00:00:00Z"),
      successCaseCount: 8,
      patternName: "Pattern B",
      approach: "Approach B"
    };

    const mockPatternC = {
      patternId: "pat_003",
      relevanceScore: 0.85,
      lastSuccessDate: new Date("2024-07-20T00:00:00Z"),
      successCaseCount: 15,
      patternName: "Pattern C",
      approach: "Approach C"
    };

    // モックエンジン: 同一スコアの候補を入力順序で返す
    const mockEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        mockPatternA,
        mockPatternB,
        mockPatternC
      ])
    };

    const newCaseCondition = {
      customerIndustry: "製造業",
      caseAmount: 5000000,
      decisionMakerCount: 3
    };

    // Act: 成功パターン候補リストを取得
    const result = findSimilarPatterns(newCaseCondition, mockEngine);

    // Assert: セカンダリソート条件により期待される順序で整列されていることを確認
    expect(result).toHaveLength(3);
    expect(result[0].patternId).toBe("pat_003"); // Pattern C: 日付2024-07-20、成功事例数15件
    expect(result[0].lastSuccessDate).toEqual(new Date("2024-07-20T00:00:00Z"));
    expect(result[0].successCaseCount).toBe(15);
    expect(result[1].patternId).toBe("pat_001"); // Pattern A: 日付2024-06-15、成功事例数12件
    expect(result[1].lastSuccessDate).toEqual(new Date("2024-06-15T00:00:00Z"));
    expect(result[1].successCaseCount).toBe(12);
    expect(result[2].patternId).toBe("pat_002"); // Pattern B: 日付2024-05-10、成功事例数8件
    expect(result[2].lastSuccessDate).toEqual(new Date("2024-05-10T00:00:00Z"));
    expect(result[2].successCaseCount).toBe(8);

    // すべてのパターンが同一の適合性スコアを持つことを確認
    expect(result[0].relevanceScore).toBe(0.85);
    expect(result[1].relevanceScore).toBe(0.85);
    expect(result[2].relevanceScore).toBe(0.85);

    // mockEngine.findSimilarPatterns が正しい条件で呼ばれたことを確認
    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseCondition);
  });
});