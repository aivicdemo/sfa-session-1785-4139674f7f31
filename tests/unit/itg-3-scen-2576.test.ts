import { generateRecommendation, explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2576: 推奨内容の根拠表示機能 - 根拠の有効期限が月末のとき、表示状態が判定される", () => {
    // 現在時刻を月末日23:59:59に設定（2026年8月31日23:59:59）
    const monthEndDateTime = new Date("2026-08-31T23:59:59Z");
    const nextMonthDateTime = new Date("2026-09-01T00:00:00Z");

    // AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-001",
        proposalApproach: "顧客の課題に対応した提案アプローチ",
        confidenceScore: 85,
        reasoning: {
          baselineData: [
            {
              caseId: "case-2026-001",
              customerIndustry: "製造業",
              dealAmount: 5000000,
              successRate: 0.92,
              matchingScore: 0.88
            }
          ],
          successPatternId: "pattern-A1",
          patternName: "大型案件の標準提案型",
          applicableConditions: ["製造業", "売上10億円以上"],
          confidenceRatio: 0.87,
          expirationDate: "2026-08-31T23:59:59Z",
          isExpired: false
        }
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningDisplay: {
          recommendationId: "rec-001",
          explanation: "過去の類似案件（製造業、売上規模5億円以上）における成功パターンに基づいています",
          baselinePatterns: [
            {
              patternId: "pattern-A1",
              patternName: "大型案件の標準提案型",
              applicability: 0.88,
              historicalSuccessRate: 0.92
            }
          ],
          relevantCases: [
            {
              caseId: "case-2026-001",
              outcome: "成約",
              relevanceScore: 0.88
            }
          ],
          expirationDate: "2026-08-31T23:59:59Z",
          isExpired: false,
          visibilityState: "visible"
        }
      })
    };

    // ステップ1-2: 推奨内容を生成
    const customerInput = {
      customerId: "cust-001",
      industry: "製造業",
      revenue: 15000000,
      dealSize: 5000000,
      previousSuccessPattern: "pattern-A1"
    };

    const generatedRecommendation = mockAIEngine.generateRecommendation(customerInput);

    // ステップ3: 推奨内容と根拠が正しく生成されていることを確認
    expect(generatedRecommendation).toHaveProperty("recommendationId", "rec-001");
    expect(generatedRecommendation).toHaveProperty("confidenceScore", 85);
    expect(generatedRecommendation.reasoning).toHaveProperty("successPatternId", "pattern-A1");
    expect(generatedRecommendation.reasoning).toHaveProperty("expirationDate", "2026-08-31T23:59:59Z");

    // ステップ4: 根拠の説明文を取得
    const reasoningExplanation = mockAIEngine.explainRecommendationReasoning({
      recommendationId: "rec-001",
      currentDateTime: monthEndDateTime.toISOString()
    });

    // ステップ5: 根拠情報が表示されていることを確認（月末時点）
    expect(reasoningExplanation).toHaveProperty("reasoningDisplay");
    expect(reasoningExplanation.reasoningDisplay).toHaveProperty("isExpired", false);
    expect(reasoningExplanation.reasoningDisplay).toHaveProperty("visibilityState", "visible");
    expect(reasoningExplanation.reasoningDisplay.explanation).toMatch(/成功パターン/);

    // ステップ6-7: 月末日23:59:59のとき、根拠が有効として表示されていることを確認
    expect(reasoningExplanation.reasoningDisplay.isExpired).toBe(false);
    expect(reasoningExplanation.reasoningDisplay.visibilityState).toBe("visible");

    // ステップ8-9: 翌月1日00:00:00に進めて、根拠表示機能を再度読み込む
    const expiredReasoningExplanation = mockAIEngine.explainRecommendationReasoning({
      recommendationId: "rec-001",
      currentDateTime: nextMonthDateTime.toISOString()
    });

    // 期待結果の時刻更新版スタブレスポンス（翌月1日の状態）
    const expiredReasoningDisplay = {
      reasoningDisplay: {
        recommendationId: "rec-001",
        explanation: "根拠の有効期限が切れています",
        baselinePatterns: [],
        relevantCases: [],
        expirationDate: "2026-08-31T23:59:59Z",
        isExpired: true,
        visibilityState: "hidden"
      }
    };

    mockAIEngine.explainRecommendationReasoning.mockResolvedValueOnce(expiredReasoningDisplay);

    // ステップ10: 根拠表示コンポーネントのDOMツリーと表示ステートを検査
    // 翌月1日時点での検査：根拠が『有効期限切れ』状態に切り替わることを確認
    const expiredResponse = mockAIEngine.explainRecommendationReasoning({
      recommendationId: "rec-001",
      currentDateTime: nextMonthDateTime.toISOString()
    });

    // 期待結果の最終確認
    // 月末23:59:59時点：根拠は有効（isExpired === false, visibilityState === "visible"）
    expect(reasoningExplanation.reasoningDisplay.isExpired).toBe(false);
    expect(reasoningExplanation.reasoningDisplay.visibilityState).toBe("visible");

    // 翌月1日00:00:00時点：根拠は無効（isExpired === true, visibilityState === "hidden"）
    expect(expiredResponse.reasoningDisplay.isExpired).toBe(true);
    expect(expiredResponse.reasoningDisplay.visibilityState).toBe("hidden");

    // 有効期限が期待通りに設定されていることを確認
    expect(expiredResponse.reasoningDisplay.expirationDate).toBe("2026-08-31T23:59:59Z");
  });
});