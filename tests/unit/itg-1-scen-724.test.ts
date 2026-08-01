import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-724
  test('成功パターン適用ガイドラインの周知完了判定機能 - 提出を行った営業担当者が0件のときも処理が正常に完了する', async () => {
    const { judgeSuccessPatternGuidelineCompletionStatus } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const input = {
      targetSalesrepIds: [],
      submittedSalesrepIds: [],
      guidanceCompletionThresholdPercent: 80,
      processStartTime: new Date('2024-01-15T09:00:00Z'),
      executionContext: {
        isAdminUser: true,
        systemLogCollector: {
          logs: [] as Array<{ timestamp: Date; message: string }>,
          addLog: function(message: string) {
            this.logs.push({
              timestamp: new Date('2024-01-15T09:00:00Z'),
              message,
            });
          },
        },
      },
    };

    const result = await judgeSuccessPatternGuidelineCompletionStatus(input);

    expect(result).toEqual({
      completionStatus: '完了',
      targetCount: 0,
      submittedCount: 0,
      completionPercent: null,
      submittedSalesrepIds: [],
      processLog: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringMatching(/対象者0件での処理完了/),
        }),
      ]),
      result: null,
    });

    expect(input.executionContext.systemLogCollector.logs).toContainEqual(
      expect.objectContaining({
        message: expect.stringMatching(/対象者0件での処理完了/),
      })
    );
  });
});