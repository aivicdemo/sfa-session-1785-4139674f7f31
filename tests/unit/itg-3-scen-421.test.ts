import { decidePriorityRank } from '../../src/logic/itg-3';

describe('改善優先度ランク決定機能', () => {
  test('SCEN-421: エラー件数が1件の場合、ランクが正しく決定される', () => {
    const errorCount = 1;
    const totalRecords = 100;

    const result = decidePriorityRank({
      errorCount,
      totalRecords,
    });

    expect(result.rank).toBe('Low');
    expect(result.priorityScore).toBe(25);
    expect(result.isUnique).toBe(true);
  });
});