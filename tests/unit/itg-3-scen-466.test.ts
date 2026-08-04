import { recommendGuidanceStrategy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  // SCEN-466
  test('スコアが中水準（41～60点）の場合、「定期指導」が推奨される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(50),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '過去の成功事例から、顧客スコアが50点の場合、定期的な接触と段階的な提案が成約につながることが確認されています。定期指導を通じて顧客のニーズ変化を捉え、適切なタイミングで次のアクションを提案することが推奨されます。'
      ),
    };

    const inputCase = {
      customerId: 'CUST-00001',
      customerName: '株式会社テスト商社',
      industry: '商社',
      scale: '中堅',
      dealScore: 50,
      dealPhase: 'initial_contact',
      createdAt: '2024-01-15T09:00:00Z',
    };

    const result = recommendGuidanceStrategy(inputCase, mockAIEngine);

    expect(result.type).toBe('定期指導');
    expect(result.reasoning).toContain('定期的な接触');
    expect(result.reasoning).toContain('段階的な提案');
    expect(result.score).toBe(50);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealScore: 50,
      })
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});