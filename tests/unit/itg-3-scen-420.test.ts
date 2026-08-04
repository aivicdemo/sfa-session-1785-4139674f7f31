import { decidePriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク決定', () => {
  test('SCEN-420: エラー件数が0件の場合、ランクAが付与される', () => {
    const input = {
      errorCount: 0,
      dataQualityScore: 95,
      aiInferenceAccuracy: 92,
    };

    const result = decidePriorityRank(input);

    expect(result.rank).toBe('A');
  });
});