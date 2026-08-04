import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2186
  test('顧客対応パターンと成功パターンのマッチスコア算出 - 成功パターンデータが欠けているとき、マッチスコアはnull/undefinedが返される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const customerResponsePattern = {
      industry: '製造業',
      dealStage: '提案済み',
      budgetScale: '500万円以上',
    };

    const result = evaluatePatternRelevance(
      customerResponsePattern,
      mockAIEngine
    );

    expect(result).toBeNull();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerResponsePattern
    );
  });
});