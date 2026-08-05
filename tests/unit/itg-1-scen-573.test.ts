import { describe, test, expect } from '@jest/globals';
import { validateSalesProcessExecutionData } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-573
  test('営業案件データが空配列の場合、エラーになる', () => {
    const empty_sales_projects = [];
    expect(() => validateSalesProcessExecutionData(empty_sales_projects)).toThrow(/営業案件データ/);
  });
});