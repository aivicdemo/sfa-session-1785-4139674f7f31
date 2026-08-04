import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2363
  test('[normal] 営業担当者提案と顧客対応パターンが存在するとき、推論精度スコアが0～100の整数値で算出される', () => {
    const proposalData = {
      title: 'クラウド導入提案',
      content: 'コスト削減とセキュリティ強化を実現',
    };

    const customerPattern = {
      industry: '製造業',
      companySize: '中堅企業',
      challenge: '既存システム老朽化',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(75),
    };

    const result = calculateInferenceAccuracyScore(proposalData, customerPattern, mockAIEngine);

    expect(result).toBe(75);
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(proposalData, customerPattern);
  });
});