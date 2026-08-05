import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  test('SCEN-328: システムヘルスチェック実行機能 - 稼働状況チェックの合格基準が未設定のとき、エラーが発生する', async () => {
    // Arrange: テスト用のフェイク AI クライアントを作成
    const mockAiClient = {
      diagnoseSystemHealth: jest.fn(),
      analyzeDataQuality: jest.fn(),
      evaluateInferencePrecision: jest.fn(),
      aggregateAndPrioritize: jest.fn(),
    };

    // 稼働状況チェックの合格基準を未設定（null）の状態で初期化
    const orchestratorConfig = {
      healthCheckThreshold: null as unknown as number,
      dataQualityThreshold: 0.95,
      inferencePrecisionThreshold: 0.95,
      aiClient: mockAiClient,
    };

    // Act & Assert: runTx3Imp1Agent オーケストレーター関数を呼び出し、エラーが発生することを検証
    try {
      await runTx3Imp1Agent(orchestratorConfig);
      fail('Expected error to be thrown');
    } catch (error: unknown) {
      // エラーオブジェクトのキャスト
      const err = error as { code?: string; message?: string };

      // Assert: エラーコードが正しいことを検証
      expect(err.code).toBe('HEALTH_CHECK_THRESHOLD_NOT_CONFIGURED');

      // Assert: エラーメッセージに期待されたキーワードが含まれることを検証
      expect(err.message).toMatch(/稼働状況チェックの合格基準/);
      expect(err.message).toMatch(/設定されていません/);
    }

    // Assert: AI クライアントの診断メソッドが呼び出されないことを検証
    // （バリデーション失敗により診断実行前に停止するため）
    expect(mockAiClient.diagnoseSystemHealth).not.toHaveBeenCalled();
    expect(mockAiClient.analyzeDataQuality).not.toHaveBeenCalled();
    expect(mockAiClient.evaluateInferencePrecision).not.toHaveBeenCalled();
    expect(mockAiClient.aggregateAndPrioritize).not.toHaveBeenCalled();
  });
});