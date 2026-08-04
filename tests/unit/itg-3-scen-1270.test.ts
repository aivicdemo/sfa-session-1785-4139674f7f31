import { evaluateProposalAppropriateness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 提案妥当性判定機能", () => {
  // SCEN-1270
  test("顧客ニーズ一覧に重複データが含まれている場合に正確な集計が行われる", () => {
    // 重複を含むニーズ一覧を準備
    const customerNeedsWithDuplicates = [
      { customerId: "A", needId: "need-1", needContent: "コスト削減", timestamp: "2024-01-10T09:00:00Z" },
      { customerId: "A", needId: "need-1", needContent: "コスト削減", timestamp: "2024-01-10T09:15:00Z" },
      { customerId: "A", needId: "need-1", needContent: "コスト削減", timestamp: "2024-01-10T09:30:00Z" },
      { customerId: "B", needId: "need-2", needContent: "業務効率化", timestamp: "2024-01-11T10:00:00Z" },
      { customerId: "B", needId: "need-2", needContent: "業務効率化", timestamp: "2024-01-11T10:30:00Z" },
      { customerId: "C", needId: "need-3", needContent: "リスク管理", timestamp: "2024-01-12T14:00:00Z" },
    ];

    // AIRecommendationEngineのスタブ
    const mockAiEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((needId: string) => {
        const scoreMap: { [key: string]: number } = {
          "need-1": 0.85,
          "need-2": 0.72,
          "need-3": 0.91,
        };
        return scoreMap[needId] || 0;
      }),
    };

    // 提案妥当性判定機能を実行
    const result = evaluateProposalAppropriateness(
      customerNeedsWithDuplicates,
      mockAiEngine
    );

    // 検証: ユニークなニーズ件数
    expect(result.uniqueNeedsCount).toBe(3);

    // 検証: 各ニーズの重複排除後の出現頻度
    expect(result.needFrequencies).toEqual({
      "need-1": 1,
      "need-2": 1,
      "need-3": 1,
    });

    // 検証: 各ニーズの平均スコア
    expect(result.averageScoresByNeed).toEqual({
      "need-1": 0.85,
      "need-2": 0.72,
      "need-3": 0.91,
    });

    // 検証: AIエンジンへの呼び出し回数（各ユニークニーズに対して1回のみ）
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith("need-1");
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith("need-2");
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith("need-3");

    // 検証: 推奨パターンマスタに保持されるレコード数
    expect(result.recommendationPatternMasterRecordCount).toBe(3);
  });
});