import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-576
  test('AIRecommendationEngine.explainRecommendationReasoningの呼び出しが失敗するとき簡略版説明が返される', () => {
    // Setup: 推奨パターンマスタの統計的上位パターン
    const mockPatternMaster = [
      {
        patternId: 'pat_001',
        successRate: 78,
        industryType: 'manufacturing',
        companyScale: 'medium',
        proposalApproach: 'approach_a',
        description: 'manufacturing industry with medium scale'
      },
      {
        patternId: 'pat_002',
        successRate: 65,
        industryType: 'retail',
        companyScale: 'large',
        proposalApproach: 'approach_b',
        description: 'retail industry with large scale'
      }
    ];

    // Mock AIRecommendationEngine that fails
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('API call failed')
      )
    };

    // Input: 推奨内容と根拠情報
    const recommendationInput = {
      recommendationId: 'rec_12345',
      customerId: 'cust_789',
      customerIndustry: 'manufacturing',
      customerScale: 'medium',
      proposedApproach: 'approach_a',
      aiEngine: mockAIEngine,
      patternMaster: mockPatternMaster
    };

    // Execute
    const result = explainRecommendationReasoning(recommendationInput);

    // Verify: 簡略版説明が返される
    expect(result).toEqual({
      reasoning: '過去の商談成功データから、貴社のような業種・規模では提案アプローチA（成功率78%）が最も効果的です',
      basePattern: {
        patternId: 'pat_001',
        successRate: 78,
        proposalApproach: 'approach_a'
      },
      isSimplified: true,
      fallbackReason: 'AIエージェント推奨説明生成失敗'
    });

    // Verify: AIエージェントが呼び出されたことを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith({
      recommendationId: 'rec_12345',
      customerId: 'cust_789',
      customerIndustry: 'manufacturing',
      customerScale: 'medium',
      proposedApproach: 'approach_a'
    });
  });
});