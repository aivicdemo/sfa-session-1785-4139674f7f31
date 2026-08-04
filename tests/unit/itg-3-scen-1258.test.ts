import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

// Mock AIRecommendationEngine
const mockAIRecommendationEngine = {
  evaluatePatternRelevance: jest.fn(),
};

describe("提案妥当性判定機能 - 複数リスク要因の反映", () => {
  // SCEN-1258
  test("複数件のリスク要因がすべて妥当性判定に反映される", () => {
    // 準備: 複数件のリスク要因データ（3件以上）を準備
    const riskFactors = [
      {
        riskFactorId: "RF001",
        description: "顧客の予算制約",
        severity: "high",
      },
      {
        riskFactorId: "RF002",
        description: "競合他社の提案",
        severity: "medium",
      },
      {
        riskFactorId: "RF003",
        description: "導入スケジュール遅延リスク",
        severity: "medium",
      },
    ];

    const proposalData = {
      proposalId: "PROP-001",
      customerId: "CUST-001",
      customerName: "顧客企業A",
      proposalContent: "システム導入提案",
      riskFactors: riskFactors,
    };

    // AIRecommendationEngineのスタブ設定
    // evaluatePatternRelevanceが複数件のリスク要因をすべて受け取ることを期待
    const expectedRelevanceScores = {
      RF001: 0.82,
      RF002: 0.71,
      RF003: 0.73,
    };

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      riskFactorScores: [
        { riskFactorId: "RF001", relevanceScore: 0.82 },
        { riskFactorId: "RF002", relevanceScore: 0.71 },
        { riskFactorId: "RF003", relevanceScore: 0.73 },
      ],
      integratedScore: 0.75,
      status: "条件付き妥当",
    });

    // 提案妥当性判定機能を呼び出し
    const result = evaluateProposalValidity(
      proposalData,
      mockAIRecommendationEngine
    );

    // AIRecommendationEngineのスタブが呼び出されたことを検証
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 引数に含まれるリスク要因の件数が入力時の件数と一致することを確認
    const callArgs =
      mockAIRecommendationEngine.evaluatePatternRelevance.mock.calls[0][0];
    expect(callArgs.riskFactors).toHaveLength(3);
    expect(callArgs.riskFactors[0].riskFactorId).toBe("RF001");
    expect(callArgs.riskFactors[1].riskFactorId).toBe("RF002");
    expect(callArgs.riskFactors[2].riskFactorId).toBe("RF003");

    // 提案妥当性判定結果を検証
    expect(result).toBeDefined();

    // 各リスク要因の妥当性スコアが結果に含まれることを確認
    expect(result.riskFactorScores).toHaveLength(3);
    expect(result.riskFactorScores[0]).toEqual({
      riskFactorId: "RF001",
      relevanceScore: 0.82,
    });
    expect(result.riskFactorScores[1]).toEqual({
      riskFactorId: "RF002",
      relevanceScore: 0.71,
    });
    expect(result.riskFactorScores[2]).toEqual({
      riskFactorId: "RF003",
      relevanceScore: 0.73,
    });

    // 統合妥当性スコアが期待値と一致することを確認
    expect(result.integratedScore).toBe(0.75);

    // 判定ステータスが期待値と一致することを確認
    expect(result.status).toBe("条件付き妥当");

    // 結果の詳細内訳を検証
    // 入力した全リスク要因数と結果に反映されたリスク要因数が一致
    expect(result.riskFactorScores.length).toBe(proposalData.riskFactors.length);

    // リスク要因の欠落や重複がないことを確認
    const resultRiskFactorIds = result.riskFactorScores.map(
      (item: { riskFactorId: string }) => item.riskFactorId
    );
    const inputRiskFactorIds = proposalData.riskFactors.map(
      (rf: { riskFactorId: string }) => rf.riskFactorId
    );
    expect(resultRiskFactorIds.sort()).toEqual(inputRiskFactorIds.sort());

    // 各要因の妥当性スコアが判定ロジックに正しく反映されていることを確認
    result.riskFactorScores.forEach(
      (item: { riskFactorId: string; relevanceScore: number }) => {
        expect(item.relevanceScore).toBe(expectedRelevanceScores[item.riskFactorId]);
      }
    );
  });
});