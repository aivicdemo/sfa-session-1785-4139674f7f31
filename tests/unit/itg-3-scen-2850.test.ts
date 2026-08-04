import { executeCorrelationEvaluation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2850: 推奨内容の成約実績相関判定機能 - 成功パターンの提案アプローチが実際の成約実績と低い相関を示した場合、判定結果が却下と決定される', () => {
    // Arrange: AIRecommendationEngineのスタブ準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '初期接触から3日以内のフォローアップ',
        patterns: [
          {
            patternId: 'PAT-001',
            description: '初期接触から3日以内のフォローアップ',
            successRate: 0.65,
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        correlationScore: 0.35,
        relevanceStatus: 'LOW',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
    };

    // テスト用の新規案件データ
    const newCaseData = {
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      customerScale: 'LARGE',
      dealAmount: 5000000,
      dealStage: 'INITIAL_CONTACT',
      dealDescription: 'Enterprise software implementation',
    };

    // 過去12ヶ月の実際の成約実績データ
    const pastPerformanceData = {
      periodMonths: 12,
      appliedApproach: '初期接触から3日以内のフォローアップ',
      totalCasesApplied: 20,
      successfulCases: 4,
      actualSuccessRate: 0.2,
      correlationWithRecommendation: 0.35,
    };

    // Act: 相関判定機能を実行
    const result = executeCorrelationEvaluation(
      newCaseData,
      pastPerformanceData,
      mockAIEngine
    );

    // Assert: 判定結果を検証
    expect(result.status).toBe('REJECTED');
    expect(result.reason).toBe(
      '推奨パターンの相関スコア0.35は閾値0.50未満であり、実績相関が不十分なため採用不可と判定されました'
    );
    expect(result.correlationScore).toBe(0.35);
  });
});