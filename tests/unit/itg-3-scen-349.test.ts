import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-349
  test('[normal] 推奨精度検証機能 - OpenAI API が停止した場合、内部推奨パターンマスタから統計的改善提案が代替返却される', async () => {
    // 推奨パターンマスタの統計値データ（成功率順に3件）
    const internalPatternMaster = [
      {
        id: 'pattern_001',
        approach: 'Trust Building Phase with Executive Sponsorship',
        successRate: 0.85,
        reasoning: 'Executive engagement early in sales cycle significantly increases close rate',
        applicableIndustries: ['Manufacturing', 'Finance'],
        minDealSize: 3000000,
      },
      {
        id: 'pattern_002',
        approach: 'Proof of Concept with Pilot Program',
        successRate: 0.80,
        reasoning: 'Pilot program reduces customer risk perception',
        applicableIndustries: ['Manufacturing', 'Retail'],
        minDealSize: 2000000,
      },
      {
        id: 'pattern_003',
        approach: 'Solution Customization with ROI Analysis',
        successRate: 0.75,
        reasoning: 'Customized solution with financial justification improves adoption',
        applicableIndustries: ['Manufacturing', 'Healthcare'],
        minDealSize: 1000000,
      },
    ];

    // AIRecommendationEngineのスタブ：API呼び出し失敗をシミュレート
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('Network error: Failed to connect to OpenAI API')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ
    const newDealInput = {
      customerIndustry: 'Manufacturing',
      dealAmount: 5000000,
      decisionMakersCount: 3,
      customerSize: 'Large',
      currentSalesStage: 'Initial Consultation',
    };

    // generateRecommendationを呼び出し
    // API失敗時のフォールバック動作：内部パターンマスタから最高成功率パターンを返す
    const result = await generateRecommendation(
      newDealInput,
      aiEngineStub,
      internalPatternMaster
    );

    // 検証1：推奨ソースが内部パターンマスタであること
    expect(result.recommendationSource).toBe('internal_pattern_master');

    // 検証2：返された成功率が0.85（最高の統計値）であること
    expect(result.successRate).toBe(0.85);

    // 検証3：返されたパターンが期待通りであること
    expect(result.pattern.approach).toBe(
      'Trust Building Phase with Executive Sponsorship'
    );

    // 検証4：根拠説明が簡略版であること
    expect(result.pattern.reasoning).toBe(
      'Executive engagement early in sales cycle significantly increases close rate'
    );

    // 検証5：isAlternativeフラグがtrueであること
    expect(result.isAlternative).toBe(true);

    // 検証6：ユーザー向けメッセージが設定されていること
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 検証7：ログメッセージにフォールバック実行の記録があること
    expect(result.logMessage).toMatch(/API呼び出し失敗/);
    expect(result.logMessage).toMatch(/内部パターンマスタ/);
    expect(result.logMessage).toMatch(/フォールバック/);

    // 検証8：生成ロジックがAIエンジンに対して最大3回の再試行を試みたことを確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});