import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { captureInferenceMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockDatabase: {
    inferenceMonitoringLogs: Array<{
      inferenceId: string;
      timestamp: string;
      inferenceType: string;
      accuracyScore: number;
      confidenceLevel: number;
      inputDataHash: string;
    }>;
  };

  beforeEach(() => {
    mockDatabase = {
      inferenceMonitoringLogs: [],
    };
  });

  afterEach(() => {
    mockDatabase.inferenceMonitoringLogs = [];
  });

  // SCEN-608
  test('AIエージェント推論精度が自動監視され、推論結果が監視ログテーブルに記録される', async () => {
    const testInferenceData = {
      inferenceId: 'INF-20240115-001',
      timestamp: '2024-01-15T10:30:45Z',
      inferenceType: 'customer_needs_analysis',
      accuracyScore: 0.87,
      confidenceLevel: 0.92,
      inputDataHash: 'hash_abc123def456',
      customerInfo: {
        customerId: 'CUST-001',
        customerName: 'テスト顧客',
        industry: 'IT',
        revenue: 10000000,
      },
      transactionHistory: [
        {
          transactionId: 'TX-001',
          date: '2024-01-10',
          amount: 500000,
          productType: 'software_license',
        },
        {
          transactionId: 'TX-002',
          date: '2024-01-12',
          amount: 300000,
          productType: 'maintenance',
        },
      ],
      proposalContent: {
        proposalId: 'PROP-001',
        proposalDate: '2024-01-15',
        suggestedProduct: 'cloud_solution',
        estimatedValue: 2000000,
      },
    };

    const result = await captureInferenceMetrics(testInferenceData, mockDatabase);

    expect(result).toEqual({
      success: true,
      recordedCount: 1,
      inferenceId: 'INF-20240115-001',
    });

    expect(mockDatabase.inferenceMonitoringLogs).toHaveLength(1);

    const recordedLog = mockDatabase.inferenceMonitoringLogs[0];
    expect(recordedLog.inferenceId).toBe('INF-20240115-001');
    expect(recordedLog.timestamp).toBe('2024-01-15T10:30:45Z');
    expect(recordedLog.inferenceType).toBe('customer_needs_analysis');
    expect(recordedLog.accuracyScore).toBe(0.87);
    expect(recordedLog.confidenceLevel).toBe(0.92);
    expect(recordedLog.inputDataHash).toBe('hash_abc123def456');
  });
});