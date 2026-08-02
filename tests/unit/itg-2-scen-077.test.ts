import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-077
  test('営業データが0件の場合、検証結果が空の判定結果を返す', () => {
    const empty_sales_data: any[] = [];

    const result = validateSalesData(empty_sales_data);

    expect(result.isValid).toBe(false);
    expect(result.validationErrors).toEqual([]);
    expect(result.processedRecordCount).toBe(0);
    expect(result.message).toBe('営業データが0件です');
  });
});