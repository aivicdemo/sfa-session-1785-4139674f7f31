import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/logic/it-1';

// Mock types and interfaces
interface HealthCheckDiagnosisResult {
  status: 'OK' | 'WARNING' | 'ERROR';
  score: number;
  timestamp: string;
}

interface DataQualityAnalysisResult {
  score: number;
  problemCount: number;
  problemAreas: string[];
  timestamp: string;
}

interface InferencePrecisionResult {
  precision: number;
  targetValue: number;
  deviationPercent: number;
  timestamp: string;
}

interface AnomalyObject {
  id: string;
  type: string;
  severityLevel: 'critical' | 'high' | 'medium' | 'low';
  impactRangeScore: number;
  impactArea: 'system_health' | 'data_quality' | 'inference_precision' | 'multi_area';
  estimatedRootCause: string;
  detectionTimestamp: string;
}

interface AuditLogEntry {
  eventType: string;
  actionName: string;
  executionTimestamp: string;
  inputParameters: Record<string, unknown>;
  outputResult: Record<string, unknown>;
}

interface Tx3Imp1AgentResult {
  aggregatedAnomalies: AnomalyObject[];
  responsePriority: Array<{ anomalyId: string; priority: 'high' | 'medium' | 'low' }>;
  auditLog: AuditLogEntry[];
}

interface Tx3Imp1AiClient {
  judgeAnomalySeverityAndImpact: (input: {
    healthCheckScore: number;
    dataQualityScore: number;
    inferencePrecisionDeviation: number;
    problemCount: number;
  }) => Promise<{
    anomalies: AnomalyObject[];
  }>;
}

// Mock AI Client factory
const createMockTx3Imp1AiClient = (): Tx3Imp1AiClient => {
  return {
    judgeAnomalySeverityAndImpact: jest.fn(async (input) => {
      const anomalies: AnomalyObject[] = [];

      // Inference precision anomaly (5% deviation)
      if (input.inferencePrecisionDeviation >= 5) {
        anomalies.push({
          id: 'anom_001_precision',
          type: 'inference_precision_deviation',
          severityLevel: 'high',
          impactRangeScore: 68,
          impactArea: 'inference_precision',
          estimatedRootCause: 'Training data quality degradation',
          detectionTimestamp: '2024-01-15T11:30:00Z',
        });
      }

      // Data quality anomaly (score 88)
      if (input.dataQualityScore < 90) {
        anomalies.push({
          id: 'anom_002_dataquality',
          type: 'data_quality_degradation',
          severityLevel: 'medium',
          impactRangeScore: 52,
          impactArea: 'data_quality',
          estimatedRootCause: 'Incomplete data entries in sales activity log',
          detectionTimestamp: '2024-01-15T11:25:00Z',
        });
      }

      // Multi-area anomaly detection
      if (
        input.inferencePrecisionDeviation >= 5 &&
        input.dataQualityScore < 90 &&
        input.problemCount >= 3
      ) {
        anomalies.push({
          id: 'anom_003_multiarea',
          type: 'multi_area_simultaneous_anomaly',
          severityLevel: 'high',
          impactRangeScore: 75,
          impactArea: 'multi_area',
          estimatedRootCause:
            'Systematic data quality issues affecting inference precision',
          detectionTimestamp: '2024-01-15T11:35:00Z',
        });
      }

      return { anomalies };
    }),
  };
};

describe('IT-1: 営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1262
  test('should execute autonomous action to judge anomaly severity and impact with integrated diagnosis results', async () => {
    // Initialize mock AI client with spied function
    const mockAiClient = createMockTx3Imp1AiClient();
    const judgeAnomalySeverityAndImpactSpy = jest.spyOn(
      mockAiClient,
      'judgeAnomalySeverityAndImpact'
    );

    // Setup preconditions: diagnostic results
    const healthCheckDiagnosisResult: HealthCheckDiagnosisResult = {
      status: 'OK',
      score: 95,
      timestamp: '2024-01-15T11:20:00Z',
    };

    const dataQualityAnalysisResult: DataQualityAnalysisResult = {
      score: 88,
      problemCount: 3,
      problemAreas: ['missing_values', 'duplicate_records', 'format_errors'],
      timestamp: '2024-01-15T11:22:00Z',
    };

    const inferencePrecisionResult: InferencePrecisionResult = {
      precision: 87,
      targetValue: 92,
      deviationPercent: 5,
      timestamp: '2024-01-15T11:24:00Z',
    };

    // Call agent function
    const result: Tx3Imp1AgentResult = await runTx3Imp1Agent(
      {
        healthCheckDiagnosisResult,
        dataQualityAnalysisResult,
        inferencePrecisionResult,
      },
      mockAiClient
    );

    // Verify AI client method was called
    expect(judgeAnomalySeverityAndImpactSpy).toHaveBeenCalled();

    // Verify the input parameters passed to the AI client
    const callArgs = judgeAnomalySeverityAndImpactSpy.mock.calls[0][0];
    expect(callArgs.healthCheckScore).toBe(95);
    expect(callArgs.dataQualityScore).toBe(88);
    expect(callArgs.inferencePrecisionDeviation).toBe(5);
    expect(callArgs.problemCount).toBe(3);

    // Verify aggregated anomalies are generated
    expect(result.aggregatedAnomalies).toBeInstanceOf(Array);
    expect(result.aggregatedAnomalies.length).toBeGreaterThan(0);

    // Verify inference precision anomaly (5% deviation) is detected with high severity
    const precisionAnomaly = result.aggregatedAnomalies.find(
      (a) => a.id === 'anom_001_precision'
    );
    expect(precisionAnomaly).toBeDefined();
    expect(precisionAnomaly?.severityLevel).toBe('high');
    expect(precisionAnomaly?.impactRangeScore).toBeGreaterThanOrEqual(65);
    expect(precisionAnomaly?.impactArea).toBe('inference_precision');
    expect(precisionAnomaly?.estimatedRootCause).toBeTruthy();

    // Verify data quality anomaly (score 88) is detected with medium severity
    const dataQualityAnomaly = result.aggregatedAnomalies.find(
      (a) => a.id === 'anom_002_dataquality'
    );
    expect(dataQualityAnomaly).toBeDefined();
    expect(dataQualityAnomaly?.severityLevel).toBe('medium');
    expect(dataQualityAnomaly?.impactRangeScore).toBeGreaterThanOrEqual(45);
    expect(dataQualityAnomaly?.impactRangeScore).toBeLessThanOrEqual(60);
    expect(dataQualityAnomaly?.impactArea).toBe('data_quality');

    // Verify multi-area simultaneous anomaly is identified
    const multiAreaAnomaly = result.aggregatedAnomalies.find(
      (a) => a.id === 'anom_003_multiarea'
    );
    expect(multiAreaAnomaly).toBeDefined();
    expect(multiAreaAnomaly?.impactArea).toBe('multi_area');
    expect(multiAreaAnomaly?.severityLevel).toBe('high');

    // Verify all anomalies have required attributes
    result.aggregatedAnomalies.forEach((anomaly) => {
      expect(anomaly.id).toBeTruthy();
      expect(['critical', 'high', 'medium', 'low']).toContain(
        anomaly.severityLevel
      );
      expect(anomaly.impactRangeScore).toBeGreaterThanOrEqual(0);
      expect(anomaly.impactRangeScore).toBeLessThanOrEqual(100);
      expect([
        'system_health',
        'data_quality',
        'inference_precision',
        'multi_area',
      ]).toContain(anomaly.impactArea);
      expect(anomaly.estimatedRootCause).toBeTruthy();
      expect(anomaly.detectionTimestamp).toBeTruthy();
    });

    // Verify audit log entries for autonomous action execution
    expect(result.auditLog).toBeInstanceOf(Array);
    expect(result.auditLog.length).toBeGreaterThan(0);

    const autonomousActionEntry = result.auditLog.find(
      (entry) =>
        entry.eventType === 'AUTONOMOUS_ACTION_EXECUTED' &&
        entry.actionName === 'judgeAnomalySeverityAndImpact'
    );
    expect(autonomousActionEntry).toBeDefined();
    expect(autonomousActionEntry?.executionTimestamp).toBeTruthy();
    expect(autonomousActionEntry?.inputParameters).toEqual(
      expect.objectContaining({
        healthCheckScore: 95,
        dataQualityScore: 88,
        inferencePrecisionDeviation: 5,
        problemCount: 3,
      })
    );
    expect(autonomousActionEntry?.outputResult).toEqual(
      expect.objectContaining({
        anomalyCount: expect.any(Number),
      })
    );

    // Verify response priority is assigned based on severity level
    expect(result.responsePriority).toBeInstanceOf(Array);
    expect(result.responsePriority.length).toBe(result.aggregatedAnomalies.length);

    result.responsePriority.forEach((priorityEntry) => {
      expect(['high', 'medium', 'low']).toContain(priorityEntry.priority);
      expect(result.aggregatedAnomalies.some((a) => a.id === priorityEntry.anomalyId)).toBe(
        true
      );
    });

    // Verify priority ordering: high > medium > low
    const highPriorityCount = result.responsePriority.filter(
      (p) => p.priority === 'high'
    ).length;
    const mediumPriorityCount = result.responsePriority.filter(
      (p) => p.priority === 'medium'
    ).length;
    const lowPriorityCount = result.responsePriority.filter(
      (p) => p.priority === 'low'
    ).length;

    expect(highPriorityCount).toBeGreaterThanOrEqual(1); // Multi-area + precision anomalies
    expect(mediumPriorityCount).toBeGreaterThanOrEqual(1); // Data quality anomaly
    expect(lowPriorityCount).toBeGreaterThanOrEqual(0);

    // Verify that high priority anomalies correspond to high severity
    result.responsePriority.forEach((priorityEntry) => {
      const correspondingAnomaly = result.aggregatedAnomalies.find(
        (a) => a.id === priorityEntry.anomalyId
      );
      if (priorityEntry.priority === 'high') {
        expect(['critical', 'high']).toContain(correspondingAnomaly?.severityLevel);
      } else if (priorityEntry.priority === 'medium') {
        expect(correspondingAnomaly?.severityLevel).toBe('medium');
      } else if (priorityEntry.priority === 'low') {
        expect(correspondingAnomaly?.severityLevel).toBe('low');
      }
    });

    // Verify final report structure
    expect(result).toEqual(
      expect.objectContaining({
        aggregatedAnomalies: expect.any(Array),
        responsePriority: expect.any(Array),
        auditLog: expect.any(Array),
      })
    );
  });
});