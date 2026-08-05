import { describe, it, expect, beforeEach } from '@jest/globals';
import { validateSalesManagerIdForFactorExtraction } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('SCEN-985: 成功要因・失敗要因の抽出と承認判定機能 - 営業管理職IDが空文字列のときエラーになる', () => {
    // Arrange
    const emptySalesManagerId = '';
    const businessCaseId = 'CASE-20240115-001';
    const operationTimestamp = new Date('2024-01-15T11:00:00Z');

    // Act & Assert
    expect(() => {
      validateSalesManagerIdForFactorExtraction({
        salesManagerId: emptySalesManagerId,
        businessCaseId: businessCaseId,
        operationTimestamp: operationTimestamp,
      });
    }).toThrow(/SALES_MANAGER_ID_EMPTY/);
  });
});