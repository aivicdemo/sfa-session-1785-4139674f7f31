import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { runTx10Imp1Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  let mockDb: any;
  let mockAiClient: any;
  let mockLogger: any;

  beforeEach(() => {
    mockDb = {
      transaction: jest.fn(async (callback: any) => callback(mockDb)),
      queryOne: jest.fn(),
      query: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    };

    mockAiClient = {
      analyzeInputData: jest.fn(),
      detectPatterns: jest.fn(),
      assessDataQuality: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1284
  test('顧客データの重大な矛盾検出時に副作用確定前に人へ引き継ぐ', async () => {
    const inputPayload = {
      salesDataInputId: 'SDINPUT-20240115-001',
      customerId: 'CUST-001',
      companyName: 'B株式会社',
      industry: '小売業',
      proposalContent: '新規商品提案',
      contactDate: '2024-01-15T10:30:00Z',
      agentId: 'AGENT-TX10-001',
    };

    const existingCustomerData = {
      customerId: 'CUST-001',
      companyName: 'A株式会社',
      industry: '製造業',
      lastUpdated: '2024-01-10T15:00:00Z',
    };

    const dataQualityCheckResult = {
      isValid: true,
      score: 92,
      missingFields: [],
      formatErrors: [],
    };

    const customerConflictDetectionResult = {
      hasConflict: true,
      conflictLevel: 'CRITICAL',
      conflictDescription: '既存顧客名A株式会社と入力データB株式会社の不一致',
      existingCompanyName: 'A株式会社',
      inputCompanyName: 'B株式会社',
      existingIndustry: '製造業',
      inputIndustry: '小売業',
      escalationReason: '顧客データの重大な矛盾',
      shouldEscalate: true,
    };

    mockDb.queryOne.mockImplementation((query: string) => {
      if (query.includes('SELECT') && query.includes('FROM customer') && query.includes('WHERE customer_id')) {
        return existingCustomerData;
      }
      if (query.includes('SELECT') && query.includes('FROM sales_data_input') && query.includes('WHERE sales_data_input_id')) {
        return { ...inputPayload, tx_status: 'INITIATED' };
      }
      return null;
    });

    mockDb.query.mockImplementation((query: string) => {
      if (query.includes('SELECT') && query.includes('FROM audit_log')) {
        return [];
      }
      return [];
    });

    mockDb.insert.mockResolvedValue({ id: 'LOG-20240115-001', insertedAt: '2024-01-15T10:35:00Z' });
    mockDb.update.mockResolvedValue({ rowsAffected: 1 });

    mockAiClient.assessDataQuality.mockResolvedValue(dataQualityCheckResult);
    mockAiClient.detectPatterns.mockResolvedValue(customerConflictDetectionResult);
    mockAiClient.analyzeInputData.mockResolvedValue({
      dataQuality: dataQualityCheckResult,
      conflictDetection: customerConflictDetectionResult,
    });

    const result = await runTx10Imp1Agent(
      inputPayload,
      mockDb,
      mockAiClient,
      mockLogger
    );

    expect(result.status).toBe('ESCALATED_AWAITING_HUMAN_REVIEW');
    expect(result.escalationReason).toBe('顧客データの重大な矛盾');
    expect(result.conflictDetail).toEqual({
      existingCompanyName: 'A株式会社',
      inputCompanyName: 'B株式会社',
      existingIndustry: '製造業',
      inputIndustry: '小売業',
    });

    expect(mockDb.update).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE sales_data_input SET tx_status'),
      expect.arrayContaining(['ESCALATED_AWAITING_HUMAN_REVIEW', inputPayload.salesDataInputId])
    );

    const auditLogInsertCall = mockDb.insert.mock.calls.find((call: any[]) =>
      call[0].includes('INSERT INTO audit_log')
    );
    expect(auditLogInsertCall).toBeDefined();
    expect(auditLogInsertCall[1]).toContain('既存顧客名A株式会社と入力データB株式会社の不一致');
    expect(auditLogInsertCall[1]).toContain('顧客データの重大な矛盾');
    expect(auditLogInsertCall[1]).toContain('AGENT-TX10-001');

    const notificationInsertCall = mockDb.insert.mock.calls.find((call: any[]) =>
      call[0].includes('INSERT INTO notification_queued')
    );
    expect(notificationInsertCall).toBeDefined();
    expect(notificationInsertCall[1]).toContain('PENDING_HUMAN_APPROVAL');

    const notificationSentCalls = mockDb.insert.mock.calls.filter((call: any[]) =>
      call[0].includes('INSERT INTO notification_sent')
    );
    expect(notificationSentCalls.length).toBe(0);

    expect(mockDb.insert).not.toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO problem_correction_applied'),
      expect.anything()
    );

    expect(result.executionSequence).toEqual([
      'DATA_QUALITY_VALIDATION',
      'CUSTOMER_CONFLICT_DETECTION',
      'ESCALATION_QUEUED',
    ]);

    expect(result.auditLogId).toBe('LOG-20240115-001');
    expect(result.auditLogCreatedAt).toBe('2024-01-15T10:35:00Z');
    expect(result.humanReviewNotificationPending).toBe(true);
    expect(result.subsequentAutomatedActionsExecuted).toBe(false);
  });
});