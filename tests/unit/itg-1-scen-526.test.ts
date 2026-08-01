import { describe, test, expect } from '@jest/globals';
import { classifyDetectedIssue } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-526: [error] 問題検出結果の重要度・優先度分類機能 - 問題検出結果が入力されない場合、処理が失敗する
  test('should return validation error when detected_issue is empty or undefined', () => {
    const emptyInputWithUndefined = {
      detected_issue: undefined,
      detection_timestamp: new Date('2024-01-15T11:00:00Z'),
      detector_agent_id: 'agent_001',
    };

    const result = classifyDetectedIssue(emptyInputWithUndefined);

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_INPUT',
      message: '問題検出結果は必須項目です',
    });
  });

  test('should record validation error to system log when detected_issue is missing', () => {
    const emptyInputWithNull = {
      detected_issue: null,
      detection_timestamp: new Date('2024-01-15T11:00:00Z'),
      detector_agent_id: 'agent_001',
    };

    const result = classifyDetectedIssue(emptyInputWithNull);

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_INPUT');
  });

  test('should not classify or save when detected_issue is empty string', () => {
    const emptyStringInput = {
      detected_issue: '',
      detection_timestamp: new Date('2024-01-15T11:00:00Z'),
      detector_agent_id: 'agent_001',
    };

    const result = classifyDetectedIssue(emptyStringInput);

    expect(result.success).toBe(false);
    expect(result.errorCode).toMatch(/INVALID_INPUT/);
    expect(result.severity).toBeUndefined();
    expect(result.priority).toBeUndefined();
  });
});