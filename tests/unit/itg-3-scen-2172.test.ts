import { calculateDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案プロセス乖離度の数値化', () => {
  // SCEN-2172
  test('分析対象の提案内容データが0件のとき、乖離度はnullまたはundefinedが返される', () => {
    const emptyProposalData: any[] = [];

    const result = calculateDeviation(emptyProposalData);

    expect(result === null || result === undefined).toBe(true);
    expect(typeof result).not.toBe('number');
  });
});