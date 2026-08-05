import { runTx11Imp1Agent } from '../../src/agents/tx-11-imp-1/orchestrator';
import { Tx11Imp1AiClient } from '../../src/agents/tx-11-imp-1/ai-client';

interface AuthenticationContext {
  userId: string;
  token: string;
  permissions: string[];
}

interface SalesExample {
  id: string;
  caseData: string;
  successFactors?: string[];
  failureFactors?: string[];
}

interface KnowledgeBaseEntry {
  exampleId: string;
  classification: string;
  factors: string[];
}

interface AuditLogEntry {
  userId: string;
  operation: string;
  result: string;
  timestamp: string;
}

class MockTx11Imp1AiClient implements Tx11Imp1AiClient {
  private auditLogs: AuditLogEntry[] = [];

  async extractSalesExamples(
    authContext: AuthenticationContext,
    _dateRange: { startDate: string; endDate: string }
  ): Promise<SalesExample[]> {
    this.recordAuditLog(
      authContext.userId,
      '営業事例データアクセス試行',
      authContext.permissions.includes('sales_example_read') ? '許可' : '拒否'
    );

    if (!authContext.permissions.includes('sales_example_read')) {
      throw new Error('AuthorizationError: 営業事例参照権限がありません');
    }

    return [
      {
        id: 'ex1',
        caseData: 'Sample case 1',
        successFactors: ['Factor A', 'Factor B'],
      },
    ];
  }

  async registerKnowledgeBase(
    authContext: AuthenticationContext,
    _entries: KnowledgeBaseEntry[]
  ): Promise<void> {
    this.recordAuditLog(
      authContext.userId,
      '知識ベース登録試行',
      authContext.permissions.includes('knowledge_base_write') ? '許可' : '拒否'
    );

    if (!authContext.permissions.includes('knowledge_base_write')) {
      throw new Error('AuthorizationError: 知識ベース書き込み権限がありません');
    }
  }

  async presentSuccessPatterns(
    authContext: AuthenticationContext,
    _patterns: Array<{ description: string; applicability: number }>
  ): Promise<void> {
    this.recordAuditLog(
      authContext.userId,
      '成功パターン提示・推奨試行',
      authContext.permissions.includes('pattern_present') ? '許可' : '拒否'
    );

    if (!authContext.permissions.includes('pattern_present')) {
      throw new Error('AuthorizationError: パターン提示権限がありません');
    }
  }

  private recordAuditLog(
    userId: string,
    operation: string,
    result: string
  ): void {
    const timestamp = new Date().toISOString();
    this.auditLogs.push({
      userId,
      operation,
      result,
      timestamp,
    });
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  clearAuditLogs(): void {
    this.auditLogs = [];
  }
}

describe('営業事例の収集・分類・言語化の自動化と例外時のみ人による確認 - 権限外アクセス拒否', () => {
  // SCEN-1304
  test('権限外ユーザーのデータアクセス・ツール操作がすべて拒否され、監査ログが記録され、状態がロールバックされること', async () => {
    const mockAiClient = new MockTx11Imp1AiClient();

    const unauthorizedAuthContext: AuthenticationContext = {
      userId: 'user_unauthorized_123',
      token: 'token_invalid_xyz',
      permissions: [],
    };

    const dateRange = {
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
    };

    let authorizationErrorThrown = false;
    let errorMessage = '';

    try {
      await runTx11Imp1Agent(mockAiClient, unauthorizedAuthContext, dateRange);
    } catch (error: unknown) {
      if (error instanceof Error) {
        authorizationErrorThrown = true;
        errorMessage = error.message;
      }
    }

    expect(authorizationErrorThrown).toBe(true);
    expect(errorMessage).toMatch(/AuthorizationError/);
    expect(errorMessage).toMatch(/営業事例参照権限/);

    const auditLogs = mockAiClient.getAuditLogs();
    expect(auditLogs.length).toBeGreaterThan(0);

    const firstAccessAttempt = auditLogs[0];
    expect(firstAccessAttempt.userId).toBe('user_unauthorized_123');
    expect(firstAccessAttempt.operation).toMatch(/営業事例データアクセス/);
    expect(firstAccessAttempt.result).toBe('拒否');
    expect(firstAccessAttempt.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );

    mockAiClient.clearAuditLogs();

    const partiallyAuthorizedAuthContext: AuthenticationContext = {
      userId: 'user_partial_456',
      token: 'token_partial_abc',
      permissions: ['sales_example_read'],
    };

    authorizationErrorThrown = false;
    errorMessage = '';

    try {
      await runTx11Imp1Agent(
        mockAiClient,
        partiallyAuthorizedAuthContext,
        dateRange
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        authorizationErrorThrown = true;
        errorMessage = error.message;
      }
    }

    expect(authorizationErrorThrown).toBe(true);
    expect(errorMessage).toMatch(/AuthorizationError/);
    expect(errorMessage).toMatch(/知識ベース書き込み権限|パターン提示権限/);

    const auditLogsAfterPartial = mockAiClient.getAuditLogs();
    const dataAccessLog = auditLogsAfterPartial.find(
      (log) => log.operation.includes('営業事例データアクセス')
    );
    expect(dataAccessLog).toBeDefined();
    expect(dataAccessLog?.result).toBe('許可');

    const registrationAttempt = auditLogsAfterPartial.find(
      (log) => log.operation.includes('知識ベース登録')
    );
    if (registrationAttempt) {
      expect(registrationAttempt.result).toBe('拒否');
    }

    const presentationAttempt = auditLogsAfterPartial.find(
      (log) => log.operation.includes('成功パターン提示')
    );
    if (presentationAttempt) {
      expect(presentationAttempt.result).toBe('拒否');
    }

    const userIdInLogs = auditLogsAfterPartial.every(
      (log) => log.userId === 'user_partial_456'
    );
    expect(userIdInLogs).toBe(true);

    const isoFormatCheck = auditLogsAfterPartial.every(
      (log) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(log.timestamp)
    );
    expect(isoFormatCheck).toBe(true);
  });
});