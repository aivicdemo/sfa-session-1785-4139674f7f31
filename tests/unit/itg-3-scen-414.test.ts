import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-414
  test('検証結果が0件の場合、スコアが基準値（100）で算出される', () => {
    const validationResults: any[] = [];
    
    const score = calculateDataQualityScore(validationResults);
    
    expect(score).toBe(100);
  });
});