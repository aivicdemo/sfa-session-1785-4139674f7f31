import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-761
  test('推奨生成ロジック(AIエージェント正常応答) - AIRecommendationEngine.generateRecommendation が成功応答したとき、推奨内容と根拠が返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: '顧客の課題に対して提案内容A を推奨',
        reasoning: '過去成功事例X との類似度が85%であり、同業他社での成約率は92%',
      }),
    };

    const input = {
      customerId: 'CUST-001',
      dealStage: 'initial_proposal',
      challengeKeyword: 'cost_optimization',
    };

    const result = await generateRecommendation(input, mockAIEngine);

    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');
    expect(result.recommendationContent).toBe('顧客の課題に対して提案内容A を推奨');
    expect(result.reasoning).toBe(
      '過去成功事例X との類似度が85%であり、同業他社での成約率は92%'
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(input);
  });
});