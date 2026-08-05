import { determineAiInferenceExecutability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-160: [edge] AIエージェント推論実行可否判定機能 - 品質検証結果が同一スコアの複数件を含むとき最新の検証結果で判定される
  test('同一スコアの複数検証結果がある場合、最新タイムスタンプの検証結果で判定を実行する', () => {
    const quality_validation_results = [
      {
        validation_result_id: 'vr-001',
        validation_timestamp: new Date('2024-01-01T10:00:00Z'),
        quality_score: 85,
        judgment_classification: '承認可能',
      },
      {
        validation_result_id: 'vr-002',
        validation_timestamp: new Date('2024-01-02T14:30:00Z'),
        quality_score: 85,
        judgment_classification: '要確認',
      },
      {
        validation_result_id: 'vr-003',
        validation_timestamp: new Date('2024-01-03T09:15:00Z'),
        quality_score: 85,
        judgment_classification: '推論実行可能',
      },
    ];

    const execution_threshold_score = 80;

    const result = determineAiInferenceExecutability(
      quality_validation_results,
      execution_threshold_score
    );

    expect(result.executable).toBe(true);
    expect(result.judgment_classification).toBe('推論実行可能');
    expect(result.latest_validation_timestamp).toEqual(
      new Date('2024-01-03T09:15:00Z')
    );
    expect(result.quality_score).toBe(85);
  });
});