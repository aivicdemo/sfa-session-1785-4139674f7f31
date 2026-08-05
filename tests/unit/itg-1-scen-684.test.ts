import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockInferenceLogDataSource: any;
  let mockAlertGenerationService: any;
  let mockExternalMonitoringService: any;

  beforeEach(() => {
    mockInferenceLogDataSource = {
      fetchLogs: jest.fn().mockResolvedValue([]),
    };

    mockAlertGenerationService = {
      generateAlert: jest.fn(),
    };

    mockExternalMonitoringService = {
      notifyError: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-684
  test('should throw error with INFERENCE_LOG_EMPTY code and skip alert generation when inference logs are empty', async () => {
    const datasource = mockInferenceLogDataSource;
    const alertService = mockAlertGenerationService;
    const externalService = mockExternalMonitoringService;

    let thrownError: any = null;

    try {
      await monitorInferenceAccuracy({
        inferenceLogDataSource: datasource,
        alertGenerationService: alertService,
        externalMonitoringService: externalService,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.message).toMatch(/推論ログが空のため精度計算不可/);
    expect(thrownError.code).toBe('INFERENCE_LOG_EMPTY');

    expect(alertService.generateAlert).not.toHaveBeenCalled();

    expect(externalService.notifyError).toHaveBeenCalledWith({
      errorCode: 'INFERENCE_LOG_EMPTY',
      message: expect.stringMatching(/推論ログが空のため精度計算不可/),
      timestamp: expect.any(String),
    });
  });
});