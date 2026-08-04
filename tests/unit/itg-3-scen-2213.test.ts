import { calculateDivergence } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 標準プロセス照合', () => {
  test('SCEN-2213: 提案内容がnullの場合、乖離度計算をスキップして空の結果を返す', () => {
    // Arrange
    const standardProcessData = {
      processSteps: [
        { stepId: 'step1', name: 'ニーズヒアリング', requiredElements: ['顧客課題', '予算'] },
        { stepId: 'step2', name: '提案準備', requiredElements: ['提案資料', '見積書'] },
        { stepId: 'step3', name: 'プレゼンテーション', requiredElements: ['説得資料', 'デモンストレーション'] }
      ],
      successCriteria: {
        minCoverageRate: 0.8,
        maxDeviationScore: 0.3
      }
    };

    const proposalContent = null;

    const mockLogger = {
      logs: [] as Array<{ level: string; message: string }>,
      warn: function(message: string) {
        this.logs.push({ level: 'warn', message });
      }
    };

    // Act
    const result = calculateDivergence(standardProcessData, proposalContent, mockLogger);

    // Assert
    expect(result).toEqual({});
    expect(result.divergenceScore).toBeUndefined();
    expect(result.deviationDetails).toBeUndefined();
    expect(result.matchedPatterns).toBeUndefined();

    expect(mockLogger.logs).toHaveLength(1);
    expect(mockLogger.logs[0].level).toBe('warn');
    expect(mockLogger.logs[0].message).toMatch(/提案内容がnullのため乖離度計算をスキップしました/);
  });
});