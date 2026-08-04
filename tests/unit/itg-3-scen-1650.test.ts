import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1650
  test('推奨数量算出値が null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const customerId = 'CUST001';
    const dealConditions = {
      industry: '製造業',
      budget: '500万円',
      challenge: '生産効率化',
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      calculateRecommendationScore(
        customerId,
        dealConditions,
        mockAIRecommendationEngine
      );
    }).toThrow(/推奨スコアの算出に失敗しました。パターン評価値が不正です（null）/);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '推奨スコア算出エラー: evaluatePatternRelevance returned null'
      )
    );

    consoleSpy.mockRestore();
  });
});