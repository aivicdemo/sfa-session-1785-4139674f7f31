import { describe, test, expect, beforeEach } from '@jest/globals';
import { detectAndPrioritizeAnomalies } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析 - 複数異常要因の優先順位判定', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-719
  test('複数の異常要因が同時に存在する場合、重要度と検出時刻に基づいて優先順位を正しく判定する', () => {
    const anomalies = [
      {
        anomalyId: 'anomaly-001',
        type: 'price_rule_violation',
        severity: 'high',
        severityScore: 95,
        detectedAt: new Date('2024-01-15T10:00:00Z'),
        description: '提案内容の価格設定ルール逸脱',
      },
      {
        anomalyId: 'anomaly-002',
        type: 'response_time_exceeded',
        severity: 'medium',
        severityScore: 70,
        detectedAt: new Date('2024-01-15T10:05:00Z'),
        description: '顧客対応の対応時間超過',
      },
      {
        anomalyId: 'anomaly-003',
        type: 'document_missing_field',
        severity: 'high',
        severityScore: 90,
        detectedAt: new Date('2024-01-15T10:02:00Z'),
        description: '提案資料の必須項目欠落',
      },
    ];

    const result = detectAndPrioritizeAnomalies(anomalies);

    expect(result).toEqual({
      prioritizedAnomalies: [
        {
          sequenceNumber: 1,
          anomalyId: 'anomaly-001',
          type: 'price_rule_violation',
          severity: 'high',
          severityScore: 95,
          detectedAt: new Date('2024-01-15T10:00:00Z'),
          description: '提案内容の価格設定ルール逸脱',
        },
        {
          sequenceNumber: 2,
          anomalyId: 'anomaly-003',
          type: 'document_missing_field',
          severity: 'high',
          severityScore: 90,
          detectedAt: new Date('2024-01-15T10:02:00Z'),
          description: '提案資料の必須項目欠落',
        },
        {
          sequenceNumber: 3,
          anomalyId: 'anomaly-002',
          type: 'response_time_exceeded',
          severity: 'medium',
          severityScore: 70,
          detectedAt: new Date('2024-01-15T10:05:00Z'),
          description: '顧客対応の対応時間超過',
        },
      ],
      totalAnomalyCount: 3,
      highSeverityCount: 2,
      mediumSeverityCount: 1,
    });

    expect(result.prioritizedAnomalies.length).toBe(3);
    expect(result.prioritizedAnomalies[0].sequenceNumber).toBe(1);
    expect(result.prioritizedAnomalies[0].severityScore).toBe(95);
    expect(result.prioritizedAnomalies[1].sequenceNumber).toBe(2);
    expect(result.prioritizedAnomalies[1].severityScore).toBe(90);
    expect(result.prioritizedAnomalies[2].sequenceNumber).toBe(3);
    expect(result.prioritizedAnomalies[2].severityScore).toBe(70);
    expect(result.totalAnomalyCount).toBe(3);
    expect(result.highSeverityCount).toBe(2);
    expect(result.mediumSeverityCount).toBe(1);
  });
});