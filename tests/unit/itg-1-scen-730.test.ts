import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { validateSuccessPatternGuidanceCompleteness } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  let mockDatabase: {
    guidelines: Array<{
      guidanceId: string;
      createdAt: string;
      status: string;
    }>;
    salesPersonStatuses: Array<{
      guidanceId: string;
      salesPersonId: string;
      applicationStatus: string | null;
    }>;
    errorLogs: Array<{
      salesPersonId: string;
      timestamp: string;
      errorCode: string;
    }>;
  };

  beforeEach(() => {
    mockDatabase = {
      guidelines: [],
      salesPersonStatuses: [],
      errorLogs: [],
    };
  });

  afterEach(() => {
    mockDatabase = {
      guidelines: [],
      salesPersonStatuses: [],
      errorLogs: [],
    };
  });

  // SCEN-730
  test("should return error when sales person application status is missing", async () => {
    // Setup: Create guidance record
    const guidanceId = "GUID-001";
    const salesPersonId = "SP-12345";
    const testTimestamp = "2024-01-15T11:00:00Z";

    mockDatabase.guidelines.push({
      guidanceId: guidanceId,
      createdAt: testTimestamp,
      status: "PENDING_COMPLETION",
    });

    // Setup: Add sales person with NULL application status
    mockDatabase.salesPersonStatuses.push({
      guidanceId: guidanceId,
      salesPersonId: salesPersonId,
      applicationStatus: null,
    });

    // Execute: Call validation function
    const result = await validateSuccessPatternGuidanceCompleteness(
      guidanceId,
      mockDatabase
    );

    // Assert: Error object contains expected error code
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("MISSING_APPLICATION_STATUS");

    // Assert: Error message contains sales person ID
    expect(result.errorMessage).toMatch(/営業担当者 ID/);
    expect(result.errorMessage).toMatch(new RegExp(salesPersonId));
    expect(result.errorMessage).toMatch(/実務適用状況が未設定です/);
    expect(result.errorMessage).toMatch(/周知完了判定を実行できません/);

    // Assert: Completion status is set to FAILED
    expect(result.completionStatus).toBe("FAILED");

    // Assert: Error log is recorded in database
    expect(mockDatabase.errorLogs.length).toBe(1);
    expect(mockDatabase.errorLogs[0].salesPersonId).toBe(salesPersonId);
    expect(mockDatabase.errorLogs[0].errorCode).toBe("MISSING_APPLICATION_STATUS");
    expect(mockDatabase.errorLogs[0].timestamp).toBeTruthy();
  });
});