import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesRepActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-707: [error] 成約実績に対応する営業案件IDが存在しないとき参照整合性エラーになる
  test('成約実績の営業案件IDが存在しないとき、参照整合性エラーを返す', () => {
    const contractRecord = {
      contractId: 'CON-20240115-001',
      contractDate: '2024-01-15',
      contractAmount: 500000,
      salesRepId: 'EMP001',
      caseId: 'CASE-999999',
    };

    const caseDatabase = new Map();

    const result = generateSalesRepActionPatternReport({
      salesRepId: 'EMP001',
      contractRecord,
      caseDatabase,
    });

    expect(result).toEqual({
      success: false,
      errorCode: 'ERR_FK_CASE_NOT_FOUND',
      errorMessage: '営業案件ID：CASE-999999に対応するレコードが見つかりません',
      reportData: null,
    });
  });
});