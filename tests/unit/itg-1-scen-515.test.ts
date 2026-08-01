import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-515
  test('[error] 営業担当者の成約実績データがnullの場合、精度スコアの算出に失敗する', () => {
    const salesRepId = 'SR001';
    const contractResults = null;
    const standardProcessSteps = 4;

    expect(() =>
      calculateInferenceAccuracyScore(salesRepId, contractResults, standardProcessSteps)
    ).toThrow(/成約実績データが不正/);
  });
});