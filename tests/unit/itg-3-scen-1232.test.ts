import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { executeValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1232
  test('[error] 提案妥当性確認判定機能 - 営業プロセス条件の適用期間外のとき、エラーを返す', () => {
    const processCondition = {
      processConditionId: 'PROC_001',
      processName: 'テスト営業プロセス',
      applicableStartDate: '2026-01-01',
      applicableEndDate: '2026-06-30',
      processSteps: [
        {
          stepId: 'STEP_001',
          stepName: 'ニーズ把握',
          order: 1,
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    const proposalData = {
      proposalId: 'PROP_001',
      customerId: 'CUST_001',
      proposalContent: 'テスト提案内容',
      createdAt: '2026-09-15T10:00:00Z',
    };

    const currentDateTime = new Date('2026-09-15T10:00:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(currentDateTime);

    const result = executeValidation(proposalData, processCondition);

    jest.useRealTimers();

    expect(result).toHaveProperty('statusCode');
    expect(result.statusCode).toBe(400);
    expect(result).toHaveProperty('errorCode');
    expect(result.errorCode).toBe('PROCESS_CONDITION_OUT_OF_PERIOD');
    expect(result).toHaveProperty('message');
    expect(result.message).toMatch(/営業プロセス条件/);
    expect(result.message).toMatch(/テスト営業プロセス/);
    expect(result.message).toMatch(/2026-01-01～2026-06-30/);
    expect(result.message).toMatch(/適用期間外/);
  });
});