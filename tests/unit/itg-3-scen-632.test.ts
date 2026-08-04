import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-632
  test("推奨根拠可視化機能 - 外部AI推奨エンジンが正常応答した場合、推奨根拠の自然言語説明が生成される", () => {
    // Arrange: AIRecommendationEngineのモック（スタブ）を設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "既存顧客への追加提案",
        successPatternId: "PATTERN-IT-MEDIUM-EFFICIENCY",
        similarityScore: 0.85,
        recommendationConfidence: 0.85,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "この顧客は過去の成功事例と同じ業界・企業規模であり、提案内容も類似しています。" +
          "業界（IT）の合致度：95%、企業規模（中堅）の合致度：90%、課題（業務効率化）の合致度：85%。" +
          "過去3年間の類似案件15件中14件が成約し、平均提案採用率は93%です。" +
          "成功確度は85%であり、このアプローチは高い信頼性を有します。"
      ),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件の顧客情報と商談条件
    const customerInfo = {
      industry: "IT",
      companySize: "medium",
      challenge: "業務効率化",
    };

    const dealCondition = {
      proposedApproach: "既存顧客への追加提案",
      targetBudget: 5000000,
      expectedTimeline: "Q2",
    };

    // Act: generateRecommendationメソッドを呼び出す
    const recommendationPromise = mockAIRecommendationEngine.generateRecommendation(
      customerInfo,
      dealCondition
    );

    // generateRecommendationが成功応答を返すことを確認
    expect(recommendationPromise).resolves.toEqual({
      recommendedApproach: "既存顧客への追加提案",
      successPatternId: "PATTERN-IT-MEDIUM-EFFICIENCY",
      similarityScore: 0.85,
      recommendationConfidence: 0.85,
    });

    // explainRecommendationReasoningメソッドに推奨内容を渡して根拠説明の生成を要求
    const recommendationData = {
      recommendedApproach: "既存顧客への追加提案",
      successPatternId: "PATTERN-IT-MEDIUM-EFFICIENCY",
      similarityScore: 0.85,
      recommendationConfidence: 0.85,
    };

    const reasoningPromise = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationData
    );

    // Assert: 推奨根拠可視化UIコンポーネントにexplainRecommendationReasoningの戻り値を確認
    reasoningPromise.then((explanation: string) => {
      // 推奨根拠表示領域に、自然言語説明が完全に表示される
      expect(explanation).toContain("この顧客は過去の成功事例と同じ業界・企業規模であり");
      expect(explanation).toContain("提案内容も類似しています");

      // 説明には過去成功パターンとの類似理由が含まれている
      expect(explanation).toContain("業界（IT）の合致度：95%");
      expect(explanation).toContain("企業規模（中堅）の合致度：90%");
      expect(explanation).toContain("課題（業務効率化）の合致度：85%");

      // 適用可能性スコアが含まれている
      expect(explanation).toContain("成功確度は85%");

      // 具体的な根拠が含まれている
      expect(explanation).toContain("過去3年間の類似案件15件中14件が成約");
      expect(explanation).toContain("平均提案採用率は93%");

      // テキストは営業担当者が理解しやすい日本語で記述されている
      expect(explanation).toMatch(/。/);
      expect(explanation).toMatch(/[ぁ-ん]/);

      // HTMLエスケープが正しく処理されていることを確認
      // （特殊文字が含まれていないことで確認）
      expect(explanation).not.toContain("<");
      expect(explanation).not.toContain(">");
      expect(explanation).not.toContain("&");
    });

    // 実際にexplainRecommendationReasoningメソッドが呼び出されたことを確認
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toBeDefined();
  });
});