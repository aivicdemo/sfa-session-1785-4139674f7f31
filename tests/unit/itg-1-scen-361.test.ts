import { performSystemHealthCheck } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-361: システムヘルスチェック合格判定機能 - システム稼働率が合格基準値直下の場合に不合格と判定される', () => {
    // Arrange: テスト入力データの準備
    const uptime_percent = 99.49;
    const uptime_threshold = 99.5;
    const data_quality_score = 95.0;
    const data_quality_threshold = 90.0;
    const inference_accuracy_score = 95.0;
    const inference_accuracy_threshold = 90.0;

    const health_check_input = {
      system_uptime_percent: uptime_percent,
      system_uptime_threshold: uptime_threshold,
      data_quality_score: data_quality_score,
      data_quality_threshold: data_quality_threshold,
      inference_accuracy_score: inference_accuracy_score,
      inference_accuracy_threshold: inference_accuracy_threshold,
    };

    // Act: システムヘルスチェック合格判定関数を実行
    const result = performSystemHealthCheck(health_check_input);

    // Assert: 判定結果を検証
    // システム稼働率99.49% < 合格基準99.5% のため、全体判定は不合格（FAIL）
    expect(result.overall_status).toBe('FAIL');

    // 判定理由にシステム稼働率に関する不合格理由が含まれることを検証
    expect(result.reason).toMatch(/稼働率/);
    expect(result.reason).toMatch(/99\.5/);
    expect(result.reason).toMatch(/以下/);

    // 詳細ステータスでシステム稼働率がFAILと判定されていることを検証
    expect(result.details.uptime_status).toBe('FAIL');
    expect(result.details.uptime_score).toBe(99.49);

    // データ品質とAI推論精度は合格基準を満たしていることを検証
    expect(result.details.data_quality_status).toBe('PASS');
    expect(result.details.inference_accuracy_status).toBe('PASS');
  });
});