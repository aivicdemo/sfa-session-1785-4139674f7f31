import { runTx3Imp1Agent } from '../../src/logic/it-1';

// Mock types for AI client
interface Tx3Imp1AiClientMock {
  executeHealthCheckDiagnosis: jest.Mock;
  executeDataQualityAnalysis: jest.Mock;
  executeInferencePrecisionEvaluation: jest.Mock;
}

interface AuditEvent {
  type: string;
  agentId: string;
  executingUserId: string;
  deniedAction?: string;
  timestamp: string;
}

interface DiagnosticResult {
  healthCheckStatus?: object;
  dataQualityAnalysis?: object;
  inferencePrecisionEvaluation?: object;
}

describe('Tx3Imp1Agent - Authorization Denial', () => {
  // SCEN-1271
  test('should reject API access when user lacks health check diagnostic permission and return structured authorization error', async () => {
    // Arrange
    const executingUserId = 'user_12345';
    const agentId = 'agent_tx3_imp1_001';
    const currentTimestamp = new Date('2024-01-15T14:30:00Z').toISOString();
    
    const auditLog: AuditEvent[] = [];
    const diagnosticReportOutput: DiagnosticResult[] = [];

    // Create mock AI client that denies health check access
    const mockAiClient: Tx3Imp1AiClientMock = {
      executeHealthCheckDiagnosis: jest.fn().mockRejectedValueOnce(
        new Error('HTTP 403 Forbidden: Access to health check diagnostic API denied')
      ),
      executeDataQualityAnalysis: jest.fn(),
      executeInferencePrecisionEvaluation: jest.fn(),
    };

    // Explicit authorization revocation simulation
    const deniedPermissions = {
      systemHealthCheckDiagnosis: false,
      dataQualityAnalysis: false,
      inferencePrecisionEvaluation: false,
    };

    const requestContext = {
      executingUserId,
      agentId,
      timestamp: currentTimestamp,
      deniedPermissions,
    };

    // Act
    const result = await runTx3Imp1Agent(
      {
        triggerType: 'SCHEDULED_MONITORING',
        scheduledTime: new Date('2024-01-15T14:30:00Z'),
      },
      mockAiClient,
      {
        onAuditEvent: (event: AuditEvent) => {
          auditLog.push(event);
        },
        onDiagnosticReportGenerated: (report: DiagnosticResult) => {
          diagnosticReportOutput.push(report);
        },
      },
      requestContext
    );

    // Assert

    // (1) Verify no API calls completed for data quality or inference precision
    expect(mockAiClient.executeHealthCheckDiagnosis).toHaveBeenCalledTimes(1);
    expect(mockAiClient.executeDataQualityAnalysis).not.toHaveBeenCalled();
    expect(mockAiClient.executeInferencePrecisionEvaluation).not.toHaveBeenCalled();

    // (2) & (3) & (4) Verify aggregation, integration, and priority judgment did not execute
    expect(diagnosticReportOutput).toHaveLength(0);

    // (5) Verify structured error response
    expect(result).toEqual({
      success: false,
      errorCode: 'AUTHORIZATION_DENIED',
      message: 'Access to health check diagnostic API denied',
      details: {
        deniedAction: 'runSystemHealthCheckDiagnosis',
        userId: executingUserId,
        timestamp: currentTimestamp,
      },
    });

    // (6) Verify audit event log contains authorization denial event
    const authorizationDenialEvent = auditLog.find(
      (event) => event.type === 'authorization_denied'
    );
    expect(authorizationDenialEvent).toBeDefined();
    expect(authorizationDenialEvent).toMatchObject({
      type: 'authorization_denied',
      agentId,
      executingUserId,
      deniedAction: 'runSystemHealthCheckDiagnosis',
      timestamp: currentTimestamp,
    });

    // (7) Verify no diagnostic results were persisted to database or report output
    expect(diagnosticReportOutput).toHaveLength(0);
  });
});