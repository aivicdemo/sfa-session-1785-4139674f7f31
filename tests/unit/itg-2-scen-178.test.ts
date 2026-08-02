import { decideCleaningPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-178
  test('品質検証結果が0件のとき、クリーニング優先度が決定されない', () => {
    const validation_results: any[] = [];
    
    const result = decideCleaningPriority(validation_results);
    
    expect(result).toBeNull();
  });
});