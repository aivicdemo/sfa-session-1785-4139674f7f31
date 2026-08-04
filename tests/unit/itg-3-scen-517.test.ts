import { calculateDataQualityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - データ品質スコア算出', () => {
  // SCEN-517
  test('検証対象データが0件のときスコアが初期値100で返される', () => {
    const validationTargetData: any[] = [];
    
    const result = calculateDataQualityScore(validationTargetData);
    
    expect(result).toBe(100);
  });
});