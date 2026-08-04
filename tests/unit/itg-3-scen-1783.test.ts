import { generateRecommendationWithVisibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1783: [normal] 推奨根拠の可視化機能 - 過去成功パターンが根拠として抽出される
  test("過去成功パターンが根拠として抽出され可視化される", async () => {
    // Arrange: テスト用の新規案件データ
    const newCaseInput = {
      industry: "製造業",
      challenge: "生産効率化",
      budgetAmount: 5000000,
      customerId: "CUST-001",
      caseId: "CASE-NEW-001",
    };

    // 過去成功パターンのモック応答データ
    const mockSimilarPatterns = [
      {
        patternId: "P001",
        caseId: "P001",
        industry: "製造業",
        solution: "IoTセンサー導入 + 生産管理システム統合",
        contractAmount: 4800000,
        dayToContract: 45,
        similarityScore: 0.92,
      },
      {
        patternId: "P002",
        caseId: "P002",
        industry: "製造業",
        solution: "AIベース需要予測システム",
        contractAmount: 5200000,
        dayToContract: 52,
        similarityScore: 0.87,
      },
      {
        patternId: "P003",
        caseId: "P003",
        industry: "製造業",
        solution: "ロボット自動化導入",
        contractAmount: 6500000,
        dayToContract: 68,
        similarityScore: 0.75,
      },
    ];

    // 根拠説明のモック応答データ
    const mockReasoningExplanation =
      "御社の案件と同じ製造業の案件で、類似度92%のP001案件が成功しており、同様のアプローチが有効と判断されます。過去事例では同じ生産効率化課題を持つ顧客が、IoTセンサー導入と生産管理システム統合により45日間で成約に至っています。";

    // スタブ実装: AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "IoTセンサー + 生産管理システム統合",
        confidenceScore: 88,
        basedOnPatterns: ["P001", "P002", "P003"],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockReasoningExplanation),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 88,
        applicableToNewCase: true,
      }),
    };

    // Act: 推奨根拠の可視化機能を呼び出す
    const result = await generateRecommendationWithVisibility(
      newCaseInput,
      mockAIEngine
    );

    // Assert: 推奨根拠セクションが正しく構成されていることを確認

    // (1) 過去成功パターン3件が類似度の高い順でリスト表示されている
    expect(result.visiblePatterns).toHaveLength(3);
    expect(result.visiblePatterns[0].patternId).toBe("P001");
    expect(result.visiblePatterns[0].similarityScore).toBe(0.92);
    expect(result.visiblePatterns[1].patternId).toBe("P002");
    expect(result.visiblePatterns[1].similarityScore).toBe(0.87);
    expect(result.visiblePatterns[2].patternId).toBe("P003");
    expect(result.visiblePatterns[2].similarityScore).toBe(0.75);

    // (2) 各パターンに対し具体的な属性情報が表示されている
    expect(result.visiblePatterns[0]).toEqual({
      patternId: "P001",
      caseId: "P001",
      industry: "製造業",
      solution: "IoTセンサー導入 + 生産管理システム統合",
      contractAmount: 4800000,
      dayToContract: 45,
      similarityScore: 0.92,
    });
    expect(result.visiblePatterns[1]).toEqual({
      patternId: "P002",
      caseId: "P002",
      industry: "製造業",
      solution: "AIベース需要予測システム",
      contractAmount: 5200000,
      dayToContract: 52,
      similarityScore: 0.87,
    });
    expect(result.visiblePatterns[2]).toEqual({
      patternId: "P003",
      caseId: "P003",
      industry: "製造業",
      solution: "ロボット自動化導入",
      contractAmount: 6500000,
      dayToContract: 68,
      similarityScore: 0.75,
    });

    // (3) AIRecommendationEngine.explainRecommendationReasoningにより生成された根拠説明が表示されている
    expect(result.reasoningExplanation).toBe(mockReasoningExplanation);
    expect(result.reasoningExplanation).toMatch(/同じ製造業/);
    expect(result.reasoningExplanation).toMatch(/類似度92%/);
    expect(result.reasoningExplanation).toMatch(/P001案件/);
    expect(result.reasoningExplanation).toMatch(/45日間/);

    // (4) 推奨根拠ラベルが表示されている
    expect(result.basedOnPatternsLabel).toBe(
      "この推奨は過去成功パターンに基づいています"
    );

    // (5) 推奨内容全体の信頼度スコアが0～100の範囲で表示されている
    expect(result.recommendationConfidenceScore).toBe(88);
    expect(result.recommendationConfidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendationConfidenceScore).toBeLessThanOrEqual(100);

    // (6) 推奨アプローチが正しく構成されている
    expect(result.recommendedApproach).toBe(
      "IoTセンサー + 生産管理システム統合"
    );

    // (7) AIエンジンが適切に呼び出されている
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newCaseInput
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith({
      recommendedApproach: "IoTセンサー + 生産管理システム統合",
      similarPatterns: mockSimilarPatterns,
      newCaseInput: newCaseInput,
    });
  });
});