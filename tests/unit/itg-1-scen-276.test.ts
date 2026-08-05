import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeAndJudgeActionPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockLogger: any;
  let mockDatabase: any;

  beforeEach(() => {
    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };
    mockDatabase = {
      saveAnalysisResult: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-276: [error] 営業担当者行動パターン分析・改善指導判定機能 - 顧客接触頻度が 0 以下のとき、処理が中断される
  test('should reject analysis when customer_contact_frequency is zero or negative', () => {
    const input_zero_frequency = {
      sales_rep_id: 'SR001',
      customer_contact_frequency: 0,
      contact_pattern_data: [
        { date: '2024-01-01', contact_type: 'phone' },
        { date: '2024-01-08', contact_type: 'email' },
      ],
      success_rate: 0.65,
      logger: mockLogger,
      database: mockDatabase,
    };

    expect(() => analyzeAndJudgeActionPattern(input_zero_frequency)).toThrow(
      /INVALID_CONTACT_FREQUENCY/
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('顧客接触頻度が無効値です')
    );
    expect(mockDatabase.saveAnalysisResult).not.toHaveBeenCalled();
  });

  test('should reject analysis when customer_contact_frequency is negative', () => {
    const input_negative_frequency = {
      sales_rep_id: 'SR002',
      customer_contact_frequency: -1,
      contact_pattern_data: [
        { date: '2024-01-05', contact_type: 'visit' },
        { date: '2024-01-12', contact_type: 'call' },
      ],
      success_rate: 0.72,
      logger: mockLogger,
      database: mockDatabase,
    };

    expect(() => analyzeAndJudgeActionPattern(input_negative_frequency)).toThrow(
      /INVALID_CONTACT_FREQUENCY/
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('顧客接触頻度が無効値です')
    );
    expect(mockDatabase.saveAnalysisResult).not.toHaveBeenCalled();
  });
});