import { validateLearningDataAndDecideInference } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-176
  test('学習データ検証と推論実行判定の統合機能 - データ量が最小要件直上で品質スコアが合格ライン直下の場合に推論が保留される', () => {
    const minDataCountRequirement = 100;
    const dataCountResult = 101; // 最小要件直上
    const qualityThreshold = 0.75;
    const qualityScoreResult = 0.74; // 合格ライン直下

    const learningDataValidator = {
      validate: jest.fn().mockReturnValue({
        isValid: true,
        dataCount: dataCountResult,
        meetsMinimumRequirement: dataCountResult >= minDataCountRequirement,
      }),
    };

    const qualityScoreValidator = {
      validate: jest.fn().mockReturnValue({
        score: qualityScoreResult,
        meetsQualityThreshold: qualityScoreResult >= qualityThreshold,
      }),
    };

    const result = validateLearningDataAndDecideInference(
      learningDataValidator,
      qualityScoreValidator,
      {
        minDataCountRequirement,
        qualityThreshold,
      }
    );

    expect(result.status).toBe('PENDING');
    expect(result.reasonMessage).toContain('データ量は最小要件を満たしていますが');
    expect(result.reasonMessage).toContain('品質スコアが合格ライン以上である必要があります');
    expect(result.reasonMessage).toContain('現在のスコア: 0.74');
    expect(result.reasonMessage).toContain('必要スコア: 0.75');
    expect(result.inferenceEngineInvoked).toBe(false);
  });
});