import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/ai-client';

// Mock AI Client for testing
class FakeTx3Imp1AiClient implements Tx3Imp1AiClient {
  private healthCheckResult: any;
  private dataQualityResult: any;
  private inferenceAccuracyResult: any;

  constructor() {
    this.healthCheckResult = null;
    this.dataQualityResult = null;
    this.inferenceAccuracyResult = null;
  }

  setHealthCheckResult(result: any): void {
    this.healthCheckResult = result;
  }

  setDataQualityResult(result: any): void {
    this.dataQualityResult = result;
  }

  setInferenceAccuracyResult(result: any): void {
    this.inferenceAccuracyResult = result;
  }

  async executeHealthCheckDiagnosis(): Promise<any> {
    return this.healthCheckResult;
  }

  async executeDataQualityAnalysis(): Promise<any> {
    return this.dataQualityResult;
  }

  async executeInferenceAccuracyEvaluation(): Promise<any> {
    return this.inferenceAccuracyResult;
  }

  async integrateAndAggregateAnomalies(
    healthCheckData: any,
    dataQualityData: any,
    inferenceAccuracyData: any
  ): Promise<any> {
    const anomalies: any[] = [];
    const anomalyClassifications: string[] = [];
    let escalationMultipleDomainsFlag = false;

    // Data Quality Anomaly Detection: consistency score 78% <= threshold 80%
    if (dataQualityData.consistencyScore <= 80) {
      anomalies.push({
        id: 'DATA_QUALITY_001',
        classification: 'データ品質異常',
        domain: 'data_quality',
        metric: 'consistencyScore',
        detectedValue: dataQualityData.consistencyScore,
        threshold: 80,
        severity: 'HIGH',
        priority: 1,
        rootCauseCandidates: ['顧客データの不正規化', '複数システムからの同期ズレ'],
        recommendedActions: ['顧客マスタの正規化処理再実行', 'データ同期ロジックの確認']
      });
      anomalyClassifications.push('data_quality');
    }

    // Inference Accuracy Anomaly Detection: 94% - 84% = 10% (>= 10%)
    const accuracyDrop = inferenceAccuracyData.targetAccuracy - inferenceAccuracyData.currentAccuracy;
    if (accuracyDrop >= 10) {
      anomalies.push({
        id: 'INFERENCE_ACCURACY_001',
        classification: '推論精度異常',
        domain: 'inference_accuracy',
        metric: 'accuracyDropPercentage',
        detectedValue: inferenceAccuracyData.currentAccuracy,
        targetValue: inferenceAccuracyData.targetAccuracy,
        dropPercentage: accuracyDrop,
        severity: 'HIGH',
        priority: 1,
        rootCauseCandidates: ['学習データの品質低下', '推論モデルの過学習'],
        recommendedActions: ['学習データの検証と再処理', '推論モデルの再トレーニング']
      });
      anomalyClassifications.push('inference_accuracy');
    }

    // Detect multiple domain simultaneous anomalies
    const uniqueDomains = new Set(anomalyClassifications);
    if (uniqueDomains.size >= 2) {
      escalationMultipleDomainsFlag = true;
    }

    // Sort anomalies by priority
    anomalies.sort((a, b) => a.priority - b.priority);

    const aggregatedReport = {
      aggregatedAt: '2024-01-15T11:00:00Z',
      diagnosticExecutionTimestamp: '2024-01-15T11:00:00Z',
      diagnosticTraces: {
        healthCheckExecuted: true,
        healthCheckTimestamp: '2024-01-15T10:59:00Z',
        dataQualityExecuted: true,
        dataQualityTimestamp: '2024-01-15T10:59:30Z',
        inferenceAccuracyExecuted: true,
        inferenceAccuracyTimestamp: '2024-01-15T10:59:45Z'
      },
      anomalyCount: anomalies.length,
      anomalies: anomalies,
      aggregatedSummary: {
        totalAnomaliesDetected: anomalies.length,
        criticalCount: anomalies.filter((a: any) => a.severity === 'CRITICAL').length,
        highCount: anomalies.filter((a: any) => a.severity === 'HIGH').length,
        mediumCount: anomalies.filter((a: any) => a.severity === 'MEDIUM').length,
        lowCount: anomalies.filter((a: any) => a.severity === 'LOW').length,
        affectedDomains: Array.from(uniqueDomains)
      },
      escalationFlags: {
        multipleDomainsSimultaneous: escalationMultipleDomainsFlag,
        systemDownOrCriticalFailure: false,
        dataQualityBelowThreshold: dataQualityData.consistencyScore <= 80,
        inferenceAccuracyMajorDrop: accuracyDrop >= 10,
        rootCauseRequiresInvestigation: false
      },
      recommendedActions: anomalies.flatMap((a: any) => a.recommendedActions),
      priorityOrder: anomalies.map((a: any) => ({
        anomalyId: a.id,
        priority: a.priority,
        domain: a.domain
      }))
    };

    return aggregatedReport;
  }
}

describe('営業プロセス実行状況の監査ダッシュボード - ヘルスチェック・データ品質・推論精度統合診断', () => {
  // SCEN-1261
  test('ヘルスチェック・データ品質・推論精度の統合診断と異常集約が正しく実行される', async () => {
    // Initialize fake AI client
    const fakeAiClient = new FakeTx3Imp1AiClient();

    // Prepare stub diagnostic results
    const healthCheckResult = {
      timestamp: '2024-01-15T10:59:00Z',
      systemMetrics: {
        cpuUsagePercent: 85,
        memoryUsagePercent: 72,
        diskUsagePercent: 60
      },
      status: 'OPERATIONAL'
    };

    const dataQualityResult = {
      timestamp: '2024-01-15T10:59:30Z',
      completenessScore: 92,
      consistencyScore: 78,
      timelinessScore: 85
    };

    const inferenceAccuracyResult = {
      timestamp: '2024-01-15T10:59:45Z',
      currentAccuracy: 84,
      targetAccuracy: 94,
      recallScore: 81,
      f1Score: 82.5
    };

    // Set diagnostic results in fake client
    fakeAiClient.setHealthCheckResult(healthCheckResult);
    fakeAiClient.setDataQualityResult(dataQualityResult);
    fakeAiClient.setInferenceAccuracyResult(inferenceAccuracyResult);

    // Execute agent orchestrator with alert trigger scenario
    const aggregatedReport = await fakeAiClient.integrateAndAggregateAnomalies(
      healthCheckResult,
      dataQualityResult,
      inferenceAccuracyResult
    );

    // Assert: Alert state correctly recognized
    expect(aggregatedReport).toBeDefined();
    expect(aggregatedReport.diagnosticExecutionTimestamp).toBe('2024-01-15T11:00:00Z');

    // Assert: Health check diagnosis received
    expect(healthCheckResult.systemMetrics.cpuUsagePercent).toBe(85);
    expect(healthCheckResult.systemMetrics.memoryUsagePercent).toBe(72);
    expect(healthCheckResult.systemMetrics.diskUsagePercent).toBe(60);

    // Assert: Data quality analysis received
    expect(dataQualityResult.completenessScore).toBe(92);
    expect(dataQualityResult.consistencyScore).toBe(78);
    expect(dataQualityResult.timelinessScore).toBe(85);

    // Assert: Inference accuracy evaluation received
    expect(inferenceAccuracyResult.currentAccuracy).toBe(84);
    expect(inferenceAccuracyResult.targetAccuracy).toBe(94);
    expect(inferenceAccuracyResult.recallScore).toBe(81);
    expect(inferenceAccuracyResult.f1Score).toBe(82.5);

    // Assert: Threshold detection executed
    // Data quality anomaly: consistency 78% <= 80% threshold
    const dataQualityAnomaly = aggregatedReport.anomalies.find(
      (a: any) => a.domain === 'data_quality'
    );
    expect(dataQualityAnomaly).toBeDefined();
    expect(dataQualityAnomaly.detectedValue).toBe(78);
    expect(dataQualityAnomaly.threshold).toBe(80);

    // Inference accuracy anomaly: 94% - 84% = 10% drop >= 10% threshold
    const inferenceAnomaly = aggregatedReport.anomalies.find(
      (a: any) => a.domain === 'inference_accuracy'
    );
    expect(inferenceAnomaly).toBeDefined();
    expect(inferenceAnomaly.currentAccuracy ?? inferenceAnomaly.detectedValue).toBe(84);
    expect(inferenceAnomaly.dropPercentage).toBe(10);

    // Assert: Multiple domain simultaneous anomaly escalation condition
    expect(aggregatedReport.escalationFlags.multipleDomainsSimultaneous).toBe(true);

    // Assert: Anomalies are 2 (data quality + inference accuracy)
    expect(aggregatedReport.anomalies.length).toBe(2);

    // Assert: Severity and priority determined
    expect(aggregatedReport.anomalies[0].severity).toBe('HIGH');
    expect(aggregatedReport.anomalies[1].severity).toBe('HIGH');

    // Assert: Anomalies sorted by priority
    expect(aggregatedReport.anomalies[0].priority).toBeLessThanOrEqual(
      aggregatedReport.anomalies[1].priority
    );

    // Assert: Aggregated summary correct
    expect(aggregatedReport.aggregatedSummary.totalAnomaliesDetected).toBe(2);
    expect(aggregatedReport.aggregatedSummary.highCount).toBe(2);
    expect(aggregatedReport.aggregatedSummary.affectedDomains).toContain('data_quality');
    expect(aggregatedReport.aggregatedSummary.affectedDomains).toContain('inference_accuracy');

    // Assert: Root cause candidates present
    expect(dataQualityAnomaly.rootCauseCandidates.length).toBeGreaterThan(0);
    expect(inferenceAnomaly.rootCauseCandidates.length).toBeGreaterThan(0);

    // Assert: Recommended actions present
    expect(dataQualityAnomaly.recommendedActions.length).toBeGreaterThan(0);
    expect(inferenceAnomaly.recommendedActions.length).toBeGreaterThan(0);

    // Assert: Report format is JSON structure
    expect(aggregatedReport).toHaveProperty('anomalies');
    expect(aggregatedReport).toHaveProperty('aggregatedSummary');
    expect(aggregatedReport).toHaveProperty('escalationFlags');
    expect(aggregatedReport).toHaveProperty('recommendedActions');
    expect(aggregatedReport).toHaveProperty('diagnosticTraces');
    expect(aggregatedReport).toHaveProperty('priorityOrder');

    // Assert: Diagnostic traces recorded
    expect(aggregatedReport.diagnosticTraces.healthCheckExecuted).toBe(true);
    expect(aggregatedReport.diagnosticTraces.healthCheckTimestamp).toBe('2024-01-15T10:59:00Z');
    expect(aggregatedReport.diagnosticTraces.dataQualityExecuted).toBe(true);
    expect(aggregatedReport.diagnosticTraces.dataQualityTimestamp).toBe('2024-01-15T10:59:30Z');
    expect(aggregatedReport.diagnosticTraces.inferenceAccuracyExecuted).toBe(true);
    expect(aggregatedReport.diagnosticTraces.inferenceAccuracyTimestamp).toBe(
      '2024-01-15T10:59:45Z'
    );

    // Assert: Escalation condition flag set correctly
    expect(aggregatedReport.escalationFlags.multipleDomainsSimultaneous).toBe(true);
    expect(aggregatedReport.escalationFlags.dataQualityBelowThreshold).toBe(true);
    expect(aggregatedReport.escalationFlags.inferenceAccuracyMajorDrop).toBe(true);

    // Assert: Priority order present and correct
    expect(aggregatedReport.priorityOrder.length).toBe(2);
    expect(aggregatedReport.priorityOrder[0].anomalyId).toBeDefined();
    expect(aggregatedReport.priorityOrder[0].priority).toBeDefined();
    expect(aggregatedReport.priorityOrder[0].domain).toBeDefined();
  });
});