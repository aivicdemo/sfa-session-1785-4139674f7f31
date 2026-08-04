import { calculateDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2100
  test('提案内容データが null のとき、エラーが発生する', () => {
    expect(() => calculateDeviationScore(null)).toThrow(/提案内容/);
  });
});