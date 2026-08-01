import { performSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-220: [normal] システムヘルスチェック判定機能 - AIエージェント推論精度が合格基準を満たすとき合格判定が出力される', () => {
    // Arrange: AIエージェント推論精度が合格基準値（精度スコア 0.85以上）の入力を準備
    const health_check_input = {
      inference_accuracy_score: 0.85,
      data_quality_score: 0.90,
      system_uptime_percentage: 99.5,
    };

    // Act: システムヘルスチェック判定機能を実行
    const health_check_result = performSystemHealthCheck(health_check_input);

    // Assert: 判定結果の status が 'PASS' であることを確認
    expect(health_check_result.status).toBe('PASS');

    // Assert: 判定結果の詳細メッセージを確認
    expect(health_check_result.details).toEqual(
      expect.stringContaining('AIエージェント推論精度: 合格（精度スコア: 0.85）')
    );
  });
});