import { validateCustomerPurchaseConsiderationData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-930
  test('提案内容の日付が年度をまたぐとき日付検証が正常に実行される', () => {
    const input_start_date = new Date('2024-03-15T00:00:00Z');
    const input_end_date = new Date('2024-04-30T00:00:00Z');
    
    const result = validateCustomerPurchaseConsiderationData({
      proposal_start_date: input_start_date,
      proposal_end_date: input_end_date,
    });

    expect(result.is_valid).toBe(true);
    expect(result.crosses_fiscal_year_boundary).toBe(true);
    expect(result.fiscal_year_start).toEqual(new Date('2024-04-01T00:00:00Z'));
    expect(result.fiscal_year_end).toEqual(new Date('2025-03-31T23:59:59Z'));
    expect(result.validation_log).toMatch(/年度境界をまたぐ期間/);
    expect(result.validation_log).toMatch(/2024年3月15日/);
    expect(result.validation_log).toMatch(/2024年4月30日/);
  });
});