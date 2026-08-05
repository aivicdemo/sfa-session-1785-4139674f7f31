import { generateHealthCheckReportWithDuplicateHandling } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-372: [edge] システムヘルスチェック結果レポート生成機能 - 複数のAIエージェント推論ログに重複データを含む場合に正常に処理される
  test('should generate health check report with duplicate inference logs correctly', () => {
    const duplicateInferenceId = 'inference_12345';
    const duplicateTimestamp = new Date('2024-01-15T10:30:00Z').toISOString();
    const duplicateAgentId = 'agent_001';

    const aiInferenceLogs = [
      {
        inference_id: duplicateInferenceId,
        timestamp: duplicateTimestamp,
        agent_identifier: duplicateAgentId,
        model_version: 'v2.1',
        inference_duration_ms: 1250,
        input_token_count: 850,
        output_token_count: 320,
        confidence_score: 0.87,
        inference_result: 'success',
      },
      {
        inference_id: duplicateInferenceId,
        timestamp: duplicateTimestamp,
        agent_identifier: duplicateAgentId,
        model_version: 'v2.1',
        inference_duration_ms: 1250,
        input_token_count: 850,
        output_token_count: 320,
        confidence_score: 0.87,
        inference_result: 'success',
      },
      {
        inference_id: duplicateInferenceId,
        timestamp: duplicateTimestamp,
        agent_identifier: duplicateAgentId,
        model_version: 'v2.1',
        inference_duration_ms: 1250,
        input_token_count: 850,
        output_token_count: 320,
        confidence_score: 0.87,
        inference_result: 'success',
      },
      {
        inference_id: duplicateInferenceId,
        timestamp: duplicateTimestamp,
        agent_identifier: duplicateAgentId,
        model_version: 'v2.1',
        inference_duration_ms: 1250,
        input_token_count: 850,
        output_token_count: 320,
        confidence_score: 0.87,
        inference_result: 'success',
      },
      {
        inference_id: duplicateInferenceId,
        timestamp: duplicateTimestamp,
        agent_identifier: duplicateAgentId,
        model_version: 'v2.1',
        inference_duration_ms: 1250,
        input_token_count: 850,
        output_token_count: 320,
        confidence_score: 0.87,
        inference_result: 'success',
      },
    ];

    const report = generateHealthCheckReportWithDuplicateHandling({
      ai_inference_logs: aiInferenceLogs,
      report_generated_at: new Date('2024-01-15T10:35:00Z').toISOString(),
    });

    expect(report.processed_inference_log_count).toBe(5);
    expect(report.duplicate_detection_count).toBe(4);
    expect(report.normalized_inference_log_count).toBe(1);
    expect(report.status).toBe('SUCCESS');
  });
});