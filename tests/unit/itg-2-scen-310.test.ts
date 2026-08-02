import { decideSalesPersonImprovementPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 改善指導優先順位の決定', () => {
  test('SCEN-310: スコアが最低点の営業担当者が最優先として優先度1が付与される', () => {
    const salesPersonScores = [
      { salesPersonId: 'A', qualityScore: 85 },
      { salesPersonId: 'B', qualityScore: 72 },
      { salesPersonId: 'C', qualityScore: 90 }
    ];

    const result = decideSalesPersonImprovementPriority(salesPersonScores);

    const personBPriority = result.find((item) => item.salesPersonId === 'B')?.priority;
    expect(personBPriority).toBe(1);
  });
});