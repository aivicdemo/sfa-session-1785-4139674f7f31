import { executeIntegrationWhenApproved } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 統合判定の結果が承認済み状態の場合に統合処理が実行される', () => {
  test('SCEN-1052: 統合判定ステータスが承認済みの場合、統合処理が実行される', () => {
    const detectionResultId = 'detection_001';
    const masterCustomerId1 = 'cust_master_001';
    const masterCustomerId2 = 'cust_master_002';
    const detectionReason = '顧客名と住所が一致';
    const approvalStatus = '承認済み';
    const executedAt = new Date('2024-01-15T11:00:00Z');

    const detectionResult = {
      id: detectionResultId,
      customerId1: masterCustomerId1,
      customerId2: masterCustomerId2,
      duplicateReason: detectionReason,
      integrationStatus: approvalStatus,
      detectedAt: new Date('2024-01-15T10:30:00Z'),
      approvedAt: new Date('2024-01-15T10:45:00Z'),
    };

    const mockIntegrationProcessor = jest.fn();

    const result = executeIntegrationWhenApproved(
      detectionResult,
      mockIntegrationProcessor
    );

    expect(mockIntegrationProcessor).toHaveBeenCalledTimes(1);
    expect(mockIntegrationProcessor).toHaveBeenCalledWith(detectionResult);
    expect(result).toEqual({
      integrationExecuted: true,
      detectionResultId: detectionResultId,
      mergedCustomerId: masterCustomerId1,
      deletedCustomerId: masterCustomerId2,
      executedAt: executedAt,
      reason: detectionReason,
    });
  });
});