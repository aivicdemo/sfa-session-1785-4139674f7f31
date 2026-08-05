import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/logic/it-1";

// Mock types and interfaces
interface SessionToken {
  userId: string;
  userRole: "admin" | "manager" | "user";
  departmentId: string;
  iat: number;
  exp: number;
}

interface SalesDataInput {
  customerId: string;
  proposalContent: string;
  amount: number;
  salesPersonId: string;
  timestamp: string;
}

interface AuditEvent {
  userId: string;
  userRole: string;
  action: "ALLOWED" | "DENIED";
  resource: string;
  timestamp: string;
  reason?: string;
}

interface AuthorizationError extends Error {
  name: "AuthorizationError";
  code: string;
  resource: string;
  requiredPrivilege: string;
}

// Fake AI Client for testing
class FakeTx10Imp1AiClient {
  private auditLog: AuditEvent[] = [];
  private allowedResources: Set<string>;
  private sessionContext: SessionToken;
  private toolExecutionLog: Array<{
    tool: string;
    status: "EXECUTED" | "DENIED";
    timestamp: string;
  }> = [];

  constructor(sessionToken: SessionToken) {
    this.sessionContext = sessionToken;
    this.allowedResources = this.initializeAllowedResources(sessionToken.userRole);
  }

  private initializeAllowedResources(userRole: string): Set<string> {
    const rolePermissions: Record<string, Set<string>> = {
      admin: new Set([
        "sales_data_read",
        "sales_data_write",
        "customer_master_read",
        "customer_master_write",
        "system_settings_read",
        "system_settings_write",
        "audit_log_read",
      ]),
      manager: new Set([
        "sales_data_read",
        "sales_data_write",
        "customer_master_read",
        "audit_log_read",
      ]),
      user: new Set(["sales_data_read", "sales_data_write"]),
    };
    return rolePermissions[userRole] || new Set();
  }

  private checkAuthorization(
    resource: string,
    privilege: string
  ): AuthorizationError | null {
    const requiredPrivilege = `${resource}_${privilege}`;
    if (!this.allowedResources.has(requiredPrivilege)) {
      const error: AuthorizationError = new Error(
        `Authorization denied: insufficient privileges for ${requiredPrivilege}`
      ) as AuthorizationError;
      error.name = "AuthorizationError";
      error.code = "INSUFFICIENT_PRIVILEGES";
      error.resource = resource;
      error.requiredPrivilege = requiredPrivilege;
      return error;
    }
    return null;
  }

  private recordAuditEvent(
    resource: string,
    action: "ALLOWED" | "DENIED",
    reason?: string
  ): void {
    const event: AuditEvent = {
      userId: this.sessionContext.userId,
      userRole: this.sessionContext.userRole,
      action: action,
      resource: resource,
      timestamp: new Date("2024-01-15T11:30:00Z").toISOString(),
      reason: reason,
    };
    this.auditLog.push(event);
  }

  private recordToolExecution(
    tool: string,
    status: "EXECUTED" | "DENIED"
  ): void {
    this.toolExecutionLog.push({
      tool: tool,
      status: status,
      timestamp: new Date("2024-01-15T11:30:00Z").toISOString(),
    });
  }

  public async validateSalesData(
    data: SalesDataInput
  ): Promise<{ valid: boolean; errors: string[] }> {
    const authError = this.checkAuthorization("sales_data", "read");
    if (authError) {
      this.recordAuditEvent("sales_data", "DENIED", "insufficient_privileges");
      this.recordToolExecution("validate_sales_data", "DENIED");
      throw authError;
    }

    this.recordAuditEvent("sales_data", "ALLOWED");
    this.recordToolExecution("validate_sales_data", "EXECUTED");
    return { valid: true, errors: [] };
  }

  public async readCustomerMaster(): Promise<{ customerId: string }[]> {
    const authError = this.checkAuthorization("customer_master", "read");
    if (authError) {
      this.recordAuditEvent("customer_master", "DENIED", "insufficient_privileges");
      this.recordToolExecution("read_customer_master", "DENIED");
      throw authError;
    }

    this.recordAuditEvent("customer_master", "ALLOWED");
    this.recordToolExecution("read_customer_master", "EXECUTED");
    return [{ customerId: "CUST001" }];
  }

  public async readOtherDepartmentData(): Promise<{ data: string }[]> {
    const authError = this.checkAuthorization("other_department_data", "read");
    if (authError) {
      this.recordAuditEvent(
        "other_department_data",
        "DENIED",
        "insufficient_privileges"
      );
      this.recordToolExecution("read_other_department_data", "DENIED");
      throw authError;
    }

    this.recordAuditEvent("other_department_data", "ALLOWED");
    this.recordToolExecution("read_other_department_data", "EXECUTED");
    return [{ data: "sensitive_data" }];
  }

  public async updateSystemSettings(): Promise<{ success: boolean }> {
    const authError = this.checkAuthorization("system_settings", "write");
    if (authError) {
      this.recordAuditEvent(
        "system_settings",
        "DENIED",
        "insufficient_privileges"
      );
      this.recordToolExecution("update_system_settings", "DENIED");
      throw authError;
    }

    this.recordAuditEvent("system_settings", "ALLOWED");
    this.recordToolExecution("update_system_settings", "EXECUTED");
    return { success: true };
  }

  public getAuditLog(): AuditEvent[] {
    return this.auditLog;
  }

  public getToolExecutionLog(): Array<{
    tool: string;
    status: "EXECUTED" | "DENIED";
    timestamp: string;
  }> {
    return this.toolExecutionLog;
  }

  public getDeniedOperations(): Array<{
    tool: string;
    status: "EXECUTED" | "DENIED";
    timestamp: string;
  }> {
    return this.toolExecutionLog.filter((log) => log.status === "DENIED");
  }
}

describe("営業データ入力から問題検出・通知までの自律実行 - 権限外操作拒否", () => {
  let fakeAiClient: FakeTx10Imp1AiClient;
  let sessionToken: SessionToken;
  let salesDataInput: SalesDataInput;

  beforeEach(() => {
    sessionToken = {
      userId: "USER_001",
      userRole: "user",
      departmentId: "SALES_001",
      iat: Math.floor(new Date("2024-01-15T11:00:00Z").getTime() / 1000),
      exp: Math.floor(new Date("2024-01-15T23:00:00Z").getTime() / 1000),
    };

    salesDataInput = {
      customerId: "CUST_12345",
      proposalContent: "Enterprise Solution Package",
      amount: 500000,
      salesPersonId: "SP_001",
      timestamp: "2024-01-15T11:15:00Z",
    };

    fakeAiClient = new FakeTx10Imp1AiClient(sessionToken);
  });

  afterEach(() => {
    fakeAiClient = null as any;
    sessionToken = null as any;
    salesDataInput = null as any;
  });

  // SCEN-1289
  test("権限外のデータ参照とツール操作を拒否する", async () => {
    let authorizationErrorThrown = false;
    let customerMasterAuthError: AuthorizationError | null = null;
    let systemSettingsAuthError: AuthorizationError | null = null;

    // Step 1: Sales data validation (allowed for user role)
    await expect(
      fakeAiClient.validateSalesData(salesDataInput)
    ).resolves.toEqual({ valid: true, errors: [] });

    // Step 2: Attempt to read customer master (not allowed for user role)
    try {
      await fakeAiClient.readCustomerMaster();
    } catch (error: unknown) {
      authorizationErrorThrown = true;
      customerMasterAuthError = error as AuthorizationError;
    }

    expect(authorizationErrorThrown).toBe(true);
    expect(customerMasterAuthError?.name).toBe("AuthorizationError");
    expect(customerMasterAuthError?.message).toMatch(/customer_master_read/);
    expect(customerMasterAuthError?.code).toBe("INSUFFICIENT_PRIVILEGES");

    // Step 3: Attempt to update system settings (not allowed for user role)
    authorizationErrorThrown = false;
    try {
      await fakeAiClient.updateSystemSettings();
    } catch (error: unknown) {
      authorizationErrorThrown = true;
      systemSettingsAuthError = error as AuthorizationError;
    }

    expect(authorizationErrorThrown).toBe(true);
    expect(systemSettingsAuthError?.name).toBe("AuthorizationError");
    expect(systemSettingsAuthError?.message).toMatch(/system_settings_write/);
    expect(systemSettingsAuthError?.code).toBe("INSUFFICIENT_PRIVILEGES");

    // Verification: Audit log contains multiple denied events
    const auditLog = fakeAiClient.getAuditLog();
    const deniedEvents = auditLog.filter((event) => event.action === "DENIED");

    expect(deniedEvents.length).toBe(2);

    const customerMasterDenied = deniedEvents.find(
      (event) => event.resource === "customer_master"
    );
    expect(customerMasterDenied).toEqual({
      userId: "USER_001",
      userRole: "user",
      action: "DENIED",
      resource: "customer_master",
      timestamp: "2024-01-15T11:30:00Z",
      reason: "insufficient_privileges",
    });

    const systemSettingsDenied = deniedEvents.find(
      (event) => event.resource === "system_settings"
    );
    expect(systemSettingsDenied).toEqual({
      userId: "USER_001",
      userRole: "user",
      action: "DENIED",
      resource: "system_settings",
      timestamp: "2024-01-15T11:30:00Z",
      reason: "insufficient_privileges",
    });

    // Verification: Tool execution log contains only denied operations for restricted resources
    const toolExecutionLog = fakeAiClient.getToolExecutionLog();
    const deniedOperations = fakeAiClient.getDeniedOperations();

    expect(deniedOperations.length).toBe(2);
    expect(deniedOperations).toContainEqual(
      expect.objectContaining({
        tool: "read_customer_master",
        status: "DENIED",
      })
    );
    expect(deniedOperations).toContainEqual(
      expect.objectContaining({
        tool: "update_system_settings",
        status: "DENIED",
      })
    );

    // Verification: Allowed operation (validate_sales_data) is executed
    const allowedOperations = toolExecutionLog.filter(
      (log) => log.status === "EXECUTED"
    );
    expect(allowedOperations.length).toBe(1);
    expect(allowedOperations[0]).toEqual(
      expect.objectContaining({
        tool: "validate_sales_data",
        status: "EXECUTED",
      })
    );

    // Verification: Audit log should contain allowed event for sales_data_read
    const allowedEvents = auditLog.filter((event) => event.action === "ALLOWED");
    expect(allowedEvents.length).toBe(1);
    expect(allowedEvents[0]).toEqual({
      userId: "USER_001",
      userRole: "user",
      action: "ALLOWED",
      resource: "sales_data",
      timestamp: "2024-01-15T11:30:00Z",
      reason: undefined,
    });
  });
});