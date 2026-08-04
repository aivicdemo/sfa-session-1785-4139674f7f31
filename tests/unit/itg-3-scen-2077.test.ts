import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2077
  test('顧客対応パターンが空の場合、成功パターン合致スコアが0で返される', () => {
    const customerResponsePatterns: string[] = [];

    const result = evaluatePatternRelevance(customerResponsePatterns);

    expect(result.score).toBe(0);
    expect(result.matchedPatterns).toEqual([]);
    expect(result.confidence).toBe(0);
  });
});