import { judgeInferenceExecutability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-152: [edge] AIエージェント推論実行可否判定機能 - 学習データ量が最小要件を1件未満で推論実行が保留される
  test('学習データが最小要件を1件未満で満たさない場合、推論実行が保留される', () => {
    const minRequiredTrainingDataCount = 100;
    const currentTrainingDataCount = 99;
    const inferenceExecutionRequest = {
      minRequiredTrainingDataCount,
      currentTrainingDataCount,
    };

    const result = judgeInferenceExecutability(inferenceExecutionRequest);

    expect(result.inferenceExecutionStatus).toBe('SUSPENDED');
    expect(result.errorMessage).toBe(
      '学習データが不足しています。現在: 99件、最小要件: 100件'
    );
    expect(result.isInferenceAllowed).toBe(false);
  });
});