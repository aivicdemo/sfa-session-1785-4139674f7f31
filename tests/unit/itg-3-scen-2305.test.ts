import { evaluateProposalPatternDeviation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2305: 異常パターン検出スコアが閾値直下のとき正常判定される", () => {
    // Arrange: テスト用の顧客対応パターンデータを準備
    const customerPatternData = {
      industry: "製造業",
      contractScale: "中堅企業",
      proposalApproach: "カスタマイズ重視",
      proposalContent: {
        approach: "カスタマイズ重視",
        customizationLevel: 0.85,
        implementationTimeline: "3ヶ月",
      },
      standardProcessComplianceScore: 0.699, // 閾値 0.7 直下
    };

    // Arrange: AIRecommendationEngineのスタブを作成
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.699,
        isAnomalousPattern: false,
        patternClassification: "標準プロセス内での提案",
      }),
    };

    // Act: 提案内容と顧客対応パターンの標準プロセス比較処理を実行
    const result = evaluateProposalPatternDeviation(
      customerPatternData,
      mockAIEngine
    );

    // Assert: 比較結果が期待通りであることを検証
    expect(result).toEqual({
      complianceScore: 0.699,
      isAnomalousPattern: false,
      patternClassification: "標準プロセス内での提案",
      displayMessage:
        "推奨パターンとの適合度: 69.9% - 標準プロセス内での提案です",
      warningFlag: false,
    });

    // Assert: AIエージェンスタブが期待通りに呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerPatternData
    );

    // Assert: 異常パターンフラグが立っていないことを確認
    expect(result.isAnomalousPattern).toBe(false);

    // Assert: 警告フラグが立っていないことを確認
    expect(result.warningFlag).toBe(false);

    // Assert: 適合度スコアが正確に計算されていることを確認
    expect(result.complianceScore).toBe(0.699);

    // Assert: パターン分類が「正常なバリエーション」として記録されていることを確認
    expect(result.patternClassification).toBe("標準プロセス内での提案");

    // Assert: UIに表示されるメッセージが正確であることを確認
    expect(result.displayMessage).toContain("69.9%");
    expect(result.displayMessage).toContain("標準プロセス内での提案");
  });
});