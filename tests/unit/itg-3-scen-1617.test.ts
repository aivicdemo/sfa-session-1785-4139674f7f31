import { generateRecommendationWithReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1617
  test("推奨内容の根拠可視化 - AIエージェント外部連携が正常応答したとき、生成された推奨根拠が可視化される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: "提案アプローチA",
        reasoning: [
          "成功パターン1：類似顧客での契約率85%",
          "成功パターン2：同業種での平均受注期間30日",
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "本提案は過去の類似案件（顧客規模1000名～5000名、IT予算年間500万円以上）で80%以上の成功率を記録しています。同じ業種・規模の企業では平均30日で意思決定に至っています。"
      ),
    };

    const dealInput = {
      customerName: "XYZ株式会社",
      industry: "製造業",
      employeeCount: 2000,
      annualITBudget: 8000000,
    };

    const result = await generateRecommendationWithReasoning(
      dealInput,
      mockAIEngine
    );

    expect(result.recommendation).toBe("提案アプローチA");

    expect(result.reasoning).toEqual([
      "成功パターン1：類似顧客での契約率85%",
      "成功パターン2：同業種での平均受注期間30日",
    ]);

    expect(result.reasoning).toContain("成功パターン1：類似顧客での契約率85%");
    expect(result.reasoning).toContain("成功パターン2：同業種での平均受注期間30日");

    expect(result.naturalLanguageExplanation).toBe(
      "本提案は過去の類似案件（顧客規模1000名～5000名、IT予算年間500万円以上）で80%以上の成功率を記録しています。同じ業種・規模の企業では平均30日で意思決定に至っています。"
    );

    expect(result.visualizationStructure).toEqual({
      recommendationSection: {
        title: "推奨内容",
        content: "提案アプローチA",
      },
      reasoningSection: {
        title: "根拠",
        elements: [
          {
            pattern: "成功パターン1",
            metric: "契約率",
            value: 85,
            unit: "%",
          },
          {
            pattern: "成功パターン2",
            metric: "平均受注期間",
            value: 30,
            unit: "日",
          },
        ],
        explanation:
          "本提案は過去の類似案件（顧客規模1000名～5000名、IT予算年間500万円以上）で80%以上の成功率を記録しています。同じ業種・規模の企業では平均30日で意思決定に至っています。",
      },
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      dealInput
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});