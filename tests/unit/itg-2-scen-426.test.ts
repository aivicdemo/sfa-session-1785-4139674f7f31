import { validateCorrectedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-426
  test('[normal] 修正済みデータ品質再検証 - 修正済みデータの形式が不正である場合、該当項目を改善必要項目として明示する', () => {
    const corrected_record = {
      customer_id: 'CUST001',
      customer_name: '株式会社テスト',
      sales_amount: 'abc'
    };

    const result = validateCorrectedDataQuality(corrected_record);

    expect(result.is_valid).toBe(false);
    expect(result.improvement_required_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_name: '売上金額',
          error_content: '数値形式ではありません',
          previous_value: 'abc'
        })
      ])
    );
    expect(result.improvement_required_items.length).toBeGreaterThanOrEqual(1);
  });
});