import { describe, test, expect } from '@jest/globals';
import { validateSalesProcessExecutionDashboard } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-576
  test('営業案件の担当営業担当者IDが欠落している場合、エラーになる', () => {
    const salesProjectWithoutSalesPersonId = {
      projectId: 'PROJ-001',
      customerId: 'CUST-001',
      salesPersonId: null,
      projectName: 'テスト案件',
      status: 'active',
      amount: 1000000,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() =>
      validateSalesProcessExecutionDashboard(salesProjectWithoutSalesPersonId)
    ).toThrow(/担当営業担当者ID/);
  });
});