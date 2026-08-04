import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2185
  test('顧客対応パターンと成功パターンのマッチスコア算出 - 顧客対応パターンデータが欠けているとき、マッチスコアは計算されず、null または undefined が返される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const incompleteCustomerPattern = {
      industryType: 'IT',
      dealStage: 'proposal',
      issueCategory: null,
      customerSize: undefined,
      previousSuccessCount: 5,
    };

    const successPatternMaster = {
      patternId: 'pattern_001',
      industryType: 'IT',
      dealStage: 'proposal',
      issueCategory: 'cost_reduction',
      customerSize: 'large',
      successRate: 0.85,
    };

    const result = evaluatePatternRelevance(
      incompleteCustomerPattern,
      successPatternMaster,
      mockAIEngine
    );

    expect(result).toBeNull();
    expect(typeof result).not.toBe('number');
  });
});