import { sortImprovementTargets } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-337
  test('同じ優先順位の改善指導対象者が複数いる場合、営業担当者IDで安定ソートされる', () => {
    const improvementTargets = [
      {
        salesPersonId: 'C003',
        priority: 1,
      },
      {
        salesPersonId: 'C001',
        priority: 1,
      },
      {
        salesPersonId: 'C002',
        priority: 1,
      },
    ];

    const result = sortImprovementTargets(improvementTargets);

    expect(result[0].salesPersonId).toBe('C001');
    expect(result[1].salesPersonId).toBe('C002');
    expect(result[2].salesPersonId).toBe('C003');
  });
});