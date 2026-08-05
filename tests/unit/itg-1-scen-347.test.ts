import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let systemLogMessages: string[] = [];

  beforeEach(() => {
    systemLogMessages = [];
    const originalLog = console.log;
    jest.spyOn(console, 'log').mockImplementation((message: string) => {
      systemLogMessages.push(message);
      originalLog(message);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-347
  test('推論精度の合格基準がnullのとき、ValidationErrorが発生する', () => {
    const inferenceResults = [
      {
        inferenceId: 'INF-2024-001',
        actualAccuracy: 92,
        timestamp: new Date('2024-01-15T10:00:00Z'),
        salesPersonId: 'SP-001'
      },
      {
        inferenceId: 'INF-2024-002',
        actualAccuracy: 88,
        timestamp: new Date('2024-01-15T11:00:00Z'),
        salesPersonId: 'SP-002'
      }
    ];

    const passThreshold = null;

    expect(() => {
      monitorInferenceAccuracy(inferenceResults, passThreshold);
    }).toThrow(/推論精度の合格基準が未設定です/);

    const logEntry = systemLogMessages.find((msg) =>
      msg.includes('SCEN-347') && msg.includes('passThreshold=null')
    );
    expect(logEntry).toBeDefined();
  });
});