import { calculateDeviationScoreForSalesReps } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-322
  test('商談進捗データが欠けている場合、その営業担当者の乖離度計算がスキップされる', () => {
    const incompleteRep = {
      salesRepId: 'A001',
      name: '営業担当者A',
      dealStage: null,
      progressRate: undefined,
    };

    const completeRep = {
      salesRepId: 'B001',
      name: '営業担当者B',
      dealStage: 'クローズ',
      progressRate: 100,
    };

    const input = {
      salesReps: [incompleteRep, completeRep],
    };

    const result = calculateDeviationScoreForSalesReps(input);

    const repAResult = result.results.find(
      (r: { salesRepId: string }) => r.salesRepId === 'A001',
    );
    const repBResult = result.results.find(
      (r: { salesRepId: string }) => r.salesRepId === 'B001',
    );

    expect(repAResult).toBeDefined();
    expect(repAResult.skipped).toBe(true);
    expect(repAResult.deviationScore).toBeUndefined();

    expect(repBResult).toBeDefined();
    expect(repBResult.skipped).toBe(false);
    expect(typeof repBResult.deviationScore).toBe('number');
    expect(repBResult.deviationScore).toBe(0);
  });
});