import { generateExecutiveBriefingMaterial } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料の自動生成', () => {
  test('SCEN-2023: 提案妥当性スコアが0のとき、資料内の妥当性セクションが「該当なし」と表示される', () => {
    // Arrange: AIRecommendationEngineのスタブを構成
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0,
        applicablePatterns: [],
        missingConditions: []
      })
    };

    // 顧客情報の入力
    const customerInfo = {
      companyName: 'テスト企業A',
      industry: '製造業',
      companySize: 'large',
      challengeDescription: '既存システムの老朽化による業務効率低下'
    };

    // 提案内容の入力
    const proposalContent = {
      productServiceName: 'クラウドERP導入',
      expectedEffects: '業務プロセス30%効率化、運用コスト20%削減',
      implementationPeriod: '12ヶ月',
      investmentAmount: 50000000
    };

    // 提案分析結果のデータ
    const proposalAnalysis = {
      managementGoalAlignment: 'partial',
      budgetFeasibility: true,
      scheduleConstraintCompatibility: true,
      roi: 2.5,
      riskFactors: ['導入期間中の業務停止リスク', '既存データ移行の複雑性']
    };

    // Act: 経営層向け説得資料生成を実行
    const briefingMaterial = generateExecutiveBriefingMaterial(
      customerInfo,
      proposalContent,
      proposalAnalysis,
      mockAIRecommendationEngine
    );

    // Assert: 妥当性セクションが「該当なし」と表示されることを検証
    expect(briefingMaterial).toBeDefined();
    expect(briefingMaterial.validitySection).toBeDefined();
    expect(briefingMaterial.validitySection.text).toBe('該当なし');
    expect(briefingMaterial.validitySection.score).toBe(0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '製造業',
        companySize: 'large',
        productServiceName: 'クラウドERP導入'
      })
    );
  });
});