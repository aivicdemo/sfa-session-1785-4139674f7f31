import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度自動監視機能 - アラート設定エラー検出', () => {
  let mockLogger: { info: jest.Mock; error: jest.Mock; warn: jest.Mock };
  let mockAlertConfigRepository: {
    findAll: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    mockAlertConfigRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-348
  test('[error] AIエージェント推論精度自動監視機能 - アラート設定が存在しないとき、エラーが発生する', () => {
    mockAlertConfigRepository.findAll.mockReturnValue([]);

    const result = monitorAiInferenceAccuracy(
      {
        alertConfigRepository: mockAlertConfigRepository,
        logger: mockLogger,
      },
      {
        monitoringStartTime: new Date('2024-01-15T10:00:00Z'),
        targetSystem: 'ai_inference_precision',
      }
    );

    expect(result).toHaveProperty('isError', true);
    expect(result).toHaveProperty('errorCode', 'ALERT_CONFIG_NOT_FOUND');
    expect(result.errorMessage).toMatch(/アラート設定が存在しません/);
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error.mock.calls[0][0]).toMatch(/監視機能の開始に失敗/);
  });
});