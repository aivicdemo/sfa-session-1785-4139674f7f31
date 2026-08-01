import { validateLearningDataAndAllowInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ量・品質検証機能', () => {
  // SCEN-085
  test('学習データが最小要件を満たし品質スコアがちょうど良好ラインの場合、推論実行が許可される', () => {
    const learningDataInput = {
      dataCount: 1000,
      qualityScore: 70,
    };

    const result = validateLearningDataAndAllowInference(learningDataInput);

    expect(result).toEqual({
      dataValidation: 'pass',
      qualityValidation: 'pass',
      inferencePermission: 'allowed',
      systemLog: '学習データ検証完了：OK、推論実行フェーズへ遷移',
    });
    expect(result.inferencePermission).toBe('allowed');
    expect(result.systemLog).toMatch(/検証完了/);
  });
});