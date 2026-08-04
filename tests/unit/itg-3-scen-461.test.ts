import { calculateImprovementDegree } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善実績トラッキング機能', () => {
  // SCEN-461
  test('改善前スコアから改善後スコアへの変化が0ポイントの場合、改善度が0で算出される', () => {
    const scoreBeforeImprovement = 100;
    const scoreAfterImprovement = 100;

    const improvementDegree = calculateImprovementDegree(
      scoreBeforeImprovement,
      scoreAfterImprovement
    );

    expect(improvementDegree).toBe(0);
  });
});