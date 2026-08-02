import { describe, test, expect } from '@jest/globals';
import { decidePriorityForCoachingDirective } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 改善指導優先順位決定', () => {
  // SCEN-313
  test('複数営業担当者の改善指導対象件数が0件のとき、優先順位付与がスキップされる', () => {
    const salespeople = [
      {
        salesPersonId: 'SP001',
        salesPersonName: '営業太郎',
        improvementTargetCount: 0,
        priorityRank: null,
      },
      {
        salesPersonId: 'SP002',
        salesPersonName: '営業花子',
        improvementTargetCount: 0,
        priorityRank: null,
      },
      {
        salesPersonId: 'SP003',
        salesPersonName: '営業次郎',
        improvementTargetCount: 0,
        priorityRank: null,
      },
    ];

    const result = decidePriorityForCoachingDirective(salespeople);

    expect(result).toEqual([
      {
        salesPersonId: 'SP001',
        salesPersonName: '営業太郎',
        improvementTargetCount: 0,
        priorityRank: null,
      },
      {
        salesPersonId: 'SP002',
        salesPersonName: '営業花子',
        improvementTargetCount: 0,
        priorityRank: null,
      },
      {
        salesPersonId: 'SP003',
        salesPersonName: '営業次郎',
        improvementTargetCount: 0,
        priorityRank: null,
      },
    ]);

    result.forEach((person) => {
      expect(person.priorityRank).toBeNull();
    });
  });
});