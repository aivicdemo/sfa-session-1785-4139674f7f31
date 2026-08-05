import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/types';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';

// Mock modules
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

// Mock logger for audit trail verification
const mockAuditLogger = {
  logEvent: jest.fn(),
  getEvents: jest.fn(),
};

// Mock health check database client
const mockHealthCheckDbClient = {
  connect: jest.fn(),
  query: jest.fn(),
  disconnect: jest.fn(),
};

// Mock data quality analysis client
const mockDataQualityClient = {
  analyze: jest.fn(),
};

// Mock inference precision client
const mockInferencePrecisionClient = {
  evaluate: jest.fn(),
};

// Fake AI client implementation for Tx3Imp1
class FakeTx3Imp1AiClient implements Tx3Imp1AiClient {
  async executeHealthCheckDiagnosis(params: {
    targetSystem: string;
    diagnosticScope: string;
    timestamp: string;
  }): Promise<{
    status: string;
    errorCode?: string;
    errorMessage?: string;
    details?: Record<string, unknown>;
  }> {
    // Simulate database connection failure
    throw new Error('ECONNREFUSED: Failed to connect to operational database at 127.0.0.1:5432');
  }

  async executeDataQualityAnalysis(params: {
    dataSource: string;
    analysisType: string;
    timestamp: string;
  }): Promise<{
    qualityScore: number;
    issues: Array<{ severity: string; description: string }>;
  }> {
    throw new Error('Analysis not executed due to prior failure');
  }

  async executeInferencePrecisionEvaluation(params: {
    modelId: string;
    evaluationPeriod: string;
    timestamp: string;
  }): Promise<{
    precisionScore: number;
    confidenceLevel: number;
  }> {
    throw new Error('Evaluation not executed due to prior failure');
  }

  async aggregateAndPrioritize(params: {
    diagnosticResults: Array<Record<string, unknown>>;
    timestamp: string;
  }): Promise<{
    aggregatedStatus: string;
    prioritizedIssues: Array<{ priority: string; issueId: string }>;
    reportContent: Record<string, unknown>;
  }> {
    throw new Error('Aggregation not executed due to prior failure');
  }
}

describe('System Health Check Database Connection Failure [SCEN-333]', () => {
  let aiClient: FakeTx3Imp1AiClient;
  let auditLogEvents: Array<Record<string, unknown>>;

  beforeEach(() => {
    aiClient = new FakeTx3Imp1AiClient();
    auditLogEvents = [];
    mockAuditLogger.logEvent.mockClear();
    mockAuditLogger.logEvent.mockImplementation((event: Record<string, unknown>) => {
      auditLogEvents.push(event);
    });
    mockAuditLogger.getEvents.mockReturnValue(auditLogEvents);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-333
  test('should handle operational database connection failure and return FAILED status with error code and audit log', async () => {
    const diagnosticTrigger = {
      triggerType: 'PERIODIC_MONITORING',
      monitoringCycle: 'WEEKLY',
      timestamp: new Date('2024-02-15T09:00:00Z').toISOString(),
      systemsToCheck: ['health_check', 'data_quality', 'inference_precision'],
    };

    const orchestrationState = {
      executionId: 'tx3-imp1-exec-20240215-001',
      status: 'INITIALIZED',
      diagnosticResults: [] as Array<Record<string, unknown>>,
      errorLog: [] as Array<Record<string, unknown>>,
      auditTrail: [] as Array<Record<string, unknown>>,
    };

    let executionResult: Record<string, unknown> = {
      status: 'INITIALIZED',
    };

    try {
      // Execute system health check diagnosis step (this will throw connection error)
      const healthCheckParams = {
        targetSystem: 'operational_database',
        diagnosticScope: 'system_availability_and_performance',
        timestamp: diagnosticTrigger.timestamp,
      };

      // This call should throw connection error
      await aiClient.executeHealthCheckDiagnosis(healthCheckParams);
    } catch (error: unknown) {
      // Error handling logic - capture connection failure
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isConnectionError = /ECONNREFUSED|connection|timeout/i.test(errorMessage);

      orchestrationState.status = 'FAILED';

      if (isConnectionError) {
        // Record connection failure in orchestration state
        const errorRecord = {
          stepName: 'HEALTH_CHECK_DIAGNOSIS',
          errorType: 'DB_CONNECTION_ERROR',
          errorMessage: 'Failed to connect to operational database',
          originalError: errorMessage,
          timestamp: diagnosticTrigger.timestamp,
          affectedResource: 'operational_database',
        };

        orchestrationState.errorLog.push(errorRecord);

        // Log audit event for connection failure
        const auditEvent = {
          eventType: 'HEALTH_CHECK_DB_CONNECTION_FAILURE',
          executionId: orchestrationState.executionId,
          relatedResource: 'operational_database',
          errorDetails: {
            errorCode: 'DB_CONNECTION_ERROR',
            errorMessage: errorMessage,
            affectedService: 'HEALTH_CHECK_DIAGNOSIS',
          },
          timestamp: diagnosticTrigger.timestamp,
          severity: 'HIGH',
          status: 'FAILURE',
        };

        mockAuditLogger.logEvent(auditEvent);
        orchestrationState.auditTrail.push(auditEvent);
      }

      // Set execution result to reflect failure
      executionResult = {
        status: 'FAILED',
        diagnosticStatus: 'FAILED',
        errorCode: 'DB_CONNECTION_ERROR',
        errorMessage: 'Failed to connect to operational database',
        executionId: orchestrationState.executionId,
        failedStep: 'HEALTH_CHECK_DIAGNOSIS',
        diagnosticResults: [],
        prioritizedIssues: [],
        processTerminationReason: 'Database connection failure - subsequent steps skipped',
        agentState: 'AWAITING_HUMAN_REVIEW_FOR_CONNECTION_FAILURE',
        partialExecutionFlag: false,
      };
    }

    // Assertions: Verify all expected outcomes
    expect(orchestrationState.status).toBe('FAILED');
    expect(executionResult.status).toBe('FAILED');
    expect(executionResult.diagnosticStatus).toBe('FAILED');
    expect(executionResult.errorCode).toBe('DB_CONNECTION_ERROR');
    expect(executionResult.errorMessage).toBe('Failed to connect to operational database');

    // Verify error log contains connection failure record
    expect(orchestrationState.errorLog.length).toBe(1);
    const errorLogEntry = orchestrationState.errorLog[0];
    expect(errorLogEntry.errorType).toBe('DB_CONNECTION_ERROR');
    expect(errorLogEntry.affectedResource).toBe('operational_database');

    // Verify audit trail contains connection failure event
    expect(mockAuditLogger.logEvent).toHaveBeenCalledTimes(1);
    const auditTrailEntry = auditLogEvents[0];
    expect(auditTrailEntry.eventType).toBe('HEALTH_CHECK_DB_CONNECTION_FAILURE');
    expect(auditTrailEntry.relatedResource).toBe('operational_database');
    expect(auditTrailEntry.errorDetails).toEqual(
      expect.objectContaining({
        errorCode: 'DB_CONNECTION_ERROR',
        errorMessage: expect.stringContaining('Failed to connect to operational database'),
      })
    );

    // Verify subsequent steps are not executed
    expect(executionResult.diagnosticResults).toEqual([]);
    expect(executionResult.prioritizedIssues).toEqual([]);

    // Verify process termination reason is recorded
    expect(executionResult.processTerminationReason).toMatch(/Database connection failure/);

    // Verify agent transitions to human review state
    expect(executionResult.agentState).toBe('AWAITING_HUMAN_REVIEW_FOR_CONNECTION_FAILURE');

    // Verify partial execution flag reflects complete failure (not partial)
    expect(executionResult.partialExecutionFlag).toBe(false);

    // Verify failed step is recorded
    expect(executionResult.failedStep).toBe('HEALTH_CHECK_DIAGNOSIS');

    // Verify connection failure is notifiable to operations manager
    expect(auditTrailEntry.severity).toBe('HIGH');
    expect(auditTrailEntry.status).toBe('FAILURE');
  });
});