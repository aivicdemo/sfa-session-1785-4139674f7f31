import { calculateROI } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 投資対効果算出', () => {
  // SCEN-1367
  test('期待効果額がゼロのとき投資対効果計算がエラーをスローする', () => {
    const investmentAmount = 100000;
    const expectedEffectAmount = 0;

    expect(() => {
      calculateROI({
        investmentAmount,
        expectedEffectAmount,
      });
    }).toThrow(/期待効果額/);
  });
});