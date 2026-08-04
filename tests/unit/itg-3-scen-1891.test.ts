import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  test('SCEN-1891: 照合ルールが null のとき照合に失敗する', () => {
    const mockPatternData = {
      customerIndustry: 'IT',
      customerScale: 'large',
      dealValue: 5000000,
      dealStage: 'proposal',
    };

    const matchingRule = null;

    expect(() => {
      evaluatePatternRelevance(mockPatternData, matchingRule);
    }).toThrow(/照合ルール/);
  });
});