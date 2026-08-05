import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  validateApprovalCriteriaForExtractedFactors,
  ExtractedFactorData,
  ApprovalCriteriaValidationResult,
} from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let systemLogOutput: string[] = [];

  beforeEach(() => {
    systemLogOutput = [];
    jest.spyOn(console, 'log').mockImplementation((message: string) => {
      systemLogOutput.push(message);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-968
  test('成功要因・失敗要因の抽出と承認基準検証 - ワークショップ参加者が単一の場合でも承認基準判定が正常に実行される', () => {
    const workshopId = 'WS-2024-001';
    const participantId = 'P001';
    const participantName = '営業担当者A';

    const extractedFactors: ExtractedFactorData = {
      workshopId,
      participants: [
        {
          participantId,
          participantName,
        },
      ],
      successFactors: [
        {
          factorId: 'SF-001',
          description: '顧客ニーズの早期把握',
          importance: 'high',
          extractedBy: participantId,
          extractedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        },
      ],
      failureFactors: [
        {
          factorId: 'FF-001',
          description: '提案資料の準備不足',
          importance: 'medium',
          extractedBy: participantId,
          extractedAt: new Date('2024-01-15T10:05:00Z').toISOString(),
        },
      ],
      workshopDate: new Date('2024-01-15T09:00:00Z').toISOString(),
    };

    const result: ApprovalCriteriaValidationResult =
      validateApprovalCriteriaForExtractedFactors(extractedFactors);

    expect(result.isValid).toBe(true);
    expect(result.validationStatus).toBe('判定完了');
    expect(result.successFactorCount).toBe(1);
    expect(result.failureFactorCount).toBe(1);
    expect(result.participantCount).toBe(1);
    expect(result.skippedDueToParticipantCount).toBe(false);
    expect(result.errors).toEqual([]);

    const logMessages = systemLogOutput.join('\n');
    expect(logMessages).toMatch(/単一参加者での承認基準検証/);
    expect(logMessages).toMatch(/正常完了/);
  });
});