import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateCompletionJudgment } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1027
  test('理解度確認テスト提出日時が欠落しているとき処理がエラーになること', () => {
    const input = {
      employee_id: 'EMP001',
      guideline_version: 'v1.0',
      understanding_score: 85,
      submitted_by_name: '山田太郎',
      submission_datetime: null as unknown as string,
    };

    const result = validateCompletionJudgment(input);

    expect(result).toHaveProperty('error_code');
    expect(result.error_code).toBe('MISSING_SUBMISSION_DATETIME');
    expect(result).toHaveProperty('error_message');
    expect(result.error_message).toMatch(/理解度確認テスト提出日時/);
    expect(result).toHaveProperty('completion_status');
    expect(result.completion_status).toBe('未完了');
  });
});