import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-1123: 推論ログが欠落しているとき、エラーが発生すること", async () => {
    const { monitorInferenceAccuracy } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const mockInferenceProcessId = "proc_20240115_001";
    const mockCurrentTime = new Date("2024-01-15T11:30:00Z");
    const mockEmptyInferenceLogs: Array<{
      id: string;
      process_id: string;
      created_at: Date;
    }> = [];

    const mockInferenceLogRepository = {
      findByProcessId: jest.fn().mockResolvedValue(mockEmptyInferenceLogs),
    };

    const mockAlertRepository = {
      create: jest.fn().mockResolvedValue({
        id: "alert_001",
        error_code: "ERR_INFERENCE_LOG_MISSING",
        process_id: mockInferenceProcessId,
        message: `推論ログ欠落エラー：プロセスID=${mockInferenceProcessId}、検出時刻=2024-01-15 11:30:00`,
        status: "MONITORING_FAILED",
        created_at: mockCurrentTime,
      }),
    };

    const input = {
      inference_process_id: mockInferenceProcessId,
      checked_at: mockCurrentTime,
      inference_log_repository: mockInferenceLogRepository,
      alert_repository: mockAlertRepository,
    };

    await expect(async () => {
      await monitorInferenceAccuracy(input);
    }).rejects.toThrow(/推論ログ欠落/);

    expect(mockInferenceLogRepository.findByProcessId).toHaveBeenCalledWith(
      mockInferenceProcessId
    );

    expect(mockAlertRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        error_code: "ERR_INFERENCE_LOG_MISSING",
        process_id: mockInferenceProcessId,
        status: "MONITORING_FAILED",
        message: expect.stringMatching(/推論ログ欠落エラー/),
      })
    );

    const createCallArgs = mockAlertRepository.create.mock.calls[0][0];
    expect(createCallArgs.message).toBe(
      `推論ログ欠落エラー：プロセスID=${mockInferenceProcessId}、検出時刻=2024-01-15 11:30:00`
    );
  });
});