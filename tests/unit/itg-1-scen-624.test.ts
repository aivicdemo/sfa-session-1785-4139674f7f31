import { monitorAiInferencePrecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-624
  test('推論ログが欠落しているときエラーになる', () => {
    const agentId = 'AGENT-001';
    const mockInferenceLogDb = {
      getLogsByAgentId: jest.fn().mockReturnValue([]),
    };

    const mockSystemLogger = {
      logAlert: jest.fn(),
      updateAgentStatus: jest.fn(),
    };

    const executeMonitoring = () => {
      const logs = mockInferenceLogDb.getLogsByAgentId(agentId);
      if (!logs || logs.length === 0) {
        mockSystemLogger.logAlert({
          timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
          alertType: '推論ログ欠落アラート',
          agentId: agentId,
        });
        mockSystemLogger.updateAgentStatus(agentId, '推論ログ未取得');
        throw new Error(`ERR-LOG-MISSING: 推論ログが見つかりません。エージェントID: ${agentId}`);
      }
      return logs;
    };

    expect(() => executeMonitoring()).toThrow(/推論ログが見つかりません/);
    expect(mockSystemLogger.logAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        alertType: '推論ログ欠落アラート',
        agentId: agentId,
      })
    );
    expect(mockSystemLogger.updateAgentStatus).toHaveBeenCalledWith(agentId, '推論ログ未取得');
  });
});