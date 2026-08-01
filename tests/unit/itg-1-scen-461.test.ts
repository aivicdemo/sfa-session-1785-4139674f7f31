import { monitorAIAgentInferencePrecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-461
  test('複数のAIエージェント推論が同時に実行された場合、それぞれの精度が独立して監視される', () => {
    const warningThreshold = 80;
    const alertThreshold = 70;

    const agentA = {
      agentId: 'agent-A',
      name: '営業予測モデル',
      inferredPrecision: 75,
    };

    const agentB = {
      agentId: 'agent-B',
      name: '顧客分類モデル',
      inferredPrecision: 85,
    };

    const agentC = {
      agentId: 'agent-C',
      name: '受注確度評価モデル',
      inferredPrecision: 72,
    };

    const agents = [agentA, agentB, agentC];

    const result = monitorAIAgentInferencePrecision({
      warningThreshold,
      alertThreshold,
      agents,
    });

    expect(result.monitoringResults).toHaveLength(3);

    const resultA = result.monitoringResults.find((r) => r.agentId === 'agent-A');
    expect(resultA).toBeDefined();
    expect(resultA?.precision).toBe(75);
    expect(resultA?.status).toBe('alert');
    expect(resultA?.isAlert).toBe(true);
    expect(resultA?.isWarning).toBe(false);

    const resultB = result.monitoringResults.find((r) => r.agentId === 'agent-B');
    expect(resultB).toBeDefined();
    expect(resultB?.precision).toBe(85);
    expect(resultB?.status).toBe('normal');
    expect(resultB?.isAlert).toBe(false);
    expect(resultB?.isWarning).toBe(false);

    const resultC = result.monitoringResults.find((r) => r.agentId === 'agent-C');
    expect(resultC).toBeDefined();
    expect(resultC?.precision).toBe(72);
    expect(resultC?.status).toBe('alert');
    expect(resultC?.isAlert).toBe(true);
    expect(resultC?.isWarning).toBe(false);

    expect(result.generatedAlerts).toHaveLength(2);

    const alertA = result.generatedAlerts.find((a) => a.agentId === 'agent-A');
    expect(alertA).toBeDefined();
    expect(alertA?.agentId).toBe('agent-A');
    expect(alertA?.precision).toBe(75);
    expect(alertA?.severity).toBe('alert');

    const alertC = result.generatedAlerts.find((a) => a.agentId === 'agent-C');
    expect(alertC).toBeDefined();
    expect(alertC?.agentId).toBe('agent-C');
    expect(alertC?.precision).toBe(72);
    expect(alertC?.severity).toBe('alert');

    const timestampA = alertA?.timestamp;
    const timestampC = alertC?.timestamp;
    expect(timestampA).toBeDefined();
    expect(timestampC).toBeDefined();
    expect(typeof timestampA).toBe('string');
    expect(typeof timestampC).toBe('string');

    expect(result.monitoringResults[0].agentId).not.toBe(result.monitoringResults[1].agentId);
    expect(result.monitoringResults[1].agentId).not.toBe(result.monitoringResults[2].agentId);
    expect(result.monitoringResults[0].agentId).not.toBe(result.monitoringResults[2].agentId);
  });
});