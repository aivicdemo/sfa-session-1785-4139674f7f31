import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-462
  test('AIエージェント推論ログが0件の場合、推論精度が計算されない', () => {
    const inferenceLogsEmpty: any[] = [];
    
    const systemLogMessages: string[] = [];
    const originalLog = console.log;
    console.log = jest.fn((msg: string) => {
      systemLogMessages.push(msg);
    });

    const result = calculateInferenceAccuracy(inferenceLogsEmpty);

    console.log = originalLog;

    expect(result).toBeNull();
    expect(systemLogMessages.some((msg) => msg.includes('推論ログ件数0件のため精度計算をスキップ'))).toBe(true);
  });
});