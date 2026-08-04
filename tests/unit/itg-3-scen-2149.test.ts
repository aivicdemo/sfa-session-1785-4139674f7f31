import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性の評価', () => {
  // SCEN-2149
  test('成功パターンが null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const newDealConditions = {
      customerIndustry: '製造業',
      customerScale: '中堅企業',
      dealAmount: 5000000,
      dealStage: '提案段階',
    };

    expect(() => {
      evaluatePatternRelevance(newDealConditions, mockAIEngine.evaluatePatternRelevance());
    }).toThrow(/成功パターン/);
  });
});