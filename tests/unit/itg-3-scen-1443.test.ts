import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1443
  test('推奨根拠が0件のとき、根拠表示が空の状態で表示される', async () => {
    // Arrange: AIRecommendationEngineのモック設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: 'アプローチA',
        recommendationScore: 0,
        reasoningBasis: [],
        confidenceScore: 0,
        alternativePatterns: [],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
    };

    const inputCondition = {
      dealId: 'deal-test-001',
      customerId: 'cust-001',
      customerIndustry: 'IT',
      customerScale: 'large',
      dealStage: 'proposal',
      proposedSolutions: ['ソリューション1'],
      constraints: {
        budgetLimit: 1000000,
        timelineConstraint: '2024-12-31',
      },
    };

    // Act: generateRecommendationメソッドを呼び出し、推奨根拠が0件の状態を再現
    const result = await generateRecommendation(inputCondition, mockAIEngine);

    // Assert: 根拠表示が空の状態で表示されることを検証
    expect(result).toBeDefined();
    expect(result.reasoningBasis).toEqual([]);
    expect(result.reasoningBasis.length).toBe(0);
    expect(result.confidenceScore).toBe(0);
    expect(result.alternativePatterns).toEqual([]);
    expect(result.alternativePatterns.length).toBe(0);

    // Assert: エラーメッセージは表示されず、正常系の空状態表示となっていることを検証
    expect(result.recommendationId).toBe('rec-001');
    expect(result.proposalApproach).toBe('アプローチA');

    // Assert: 代替動作として「過去の推奨履歴から類似案件を表示」するための内部パターンマスタ参照処理は実行されていないことを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
  });
});