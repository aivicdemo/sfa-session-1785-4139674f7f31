import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';

describe('システムヘルスチェック実行機能', () => {
  test('SCEN-331: チェック実行開始日時がnullのとき、ValidationErrorが発生する', async () => {
    // Arrange
    const mockAiClient = {
      executeHealthCheck: jest.fn(),
      analyzeDataQuality: jest.fn(),
      evaluateInferencePrecision: jest.fn(),
      aggregateAndPrioritize: jest.fn(),
    };

    const invalidInput = {
      checkStartDateTime: null,
      triggerType: 'scheduled',
      targetSystemIds: ['system-001', 'system-002'],
    };

    // Act & Assert
    expect(() =>
      runTx3Imp1Agent(invalidInput, mockAiClient)
    ).toThrow(/checkStartDateTime is required|チェック実行開始日時は必須項目です/);

    // Verify AI client was not called
    expect(mockAiClient.executeHealthCheck).not.toHaveBeenCalled();
    expect(mockAiClient.analyzeDataQuality).not.toHaveBeenCalled();
    expect(mockAiClient.evaluateInferencePrecision).not.toHaveBeenCalled();
    expect(mockAiClient.aggregateAndPrioritize).not.toHaveBeenCalled();
  });
});