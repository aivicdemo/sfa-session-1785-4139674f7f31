import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-798
  test('問題検出結果の分類・優先度付け機能 - 営業案件の進捗情報が取得できない場合、対応時期の判定ロジックがエラーになる', async () => {
    const { classifyDetectedProblemsWithPriority } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const mockDetectedProblem = {
      problemId: 'PROB-001',
      problemType: 'proposal_mismatch',
      severity: 'high',
      detectionTimestamp: new Date('2024-01-15T10:30:00Z'),
      salesCaseId: 'CASE-999',
      description: 'Proposal content deviates significantly from standard process',
    };

    const mockFetchProgressInfo = jest.fn().mockResolvedValue(null);

    let caughtError: Error | null = null;

    try {
      await classifyDetectedProblemsWithPriority(
        [mockDetectedProblem],
        mockFetchProgressInfo
      );
    } catch (err) {
      if (err instanceof Error) {
        caughtError = err;
      }
    }

    expect(caughtError).not.toBeNull();
    expect(caughtError).toBeInstanceOf(Error);
    expect(caughtError?.message).toMatch(/進捗情報/);
    expect(caughtError?.stack).toMatch(/対応時期判定ロジック/);

    const errorMessage = caughtError?.message || '';
    const errorStack = caughtError?.stack || '';

    expect(errorMessage).toBe(
      '営業案件の進捗情報が取得できません。対応時期の判定を実行できません。'
    );
    expect(errorStack).toContain('対応時期判定ロジック');
  });
});