import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-607
  test('妥当性検証で日付形式が不正な場合、不合格と判定される', () => {
    const salesData = {
      contactDate: '2024/01/15',
      customerId: 'CUST-001',
      dealName: 'Deal A'
    };

    const validationRules = {
      contactDate: {
        fieldName: 'contactDate',
        format: 'YYYY-MM-DD',
        type: 'date'
      }
    };

    const result = validateSalesData(salesData, validationRules);

    expect(result.status).toBe('不合格');
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        fieldName: 'contactDate',
        message: expect.stringMatching(/日付フィールドの形式が不正です/)
      })
    );
    expect(result.errors[0].message).toMatch(/YYYY-MM-DD/);
    expect(result.errors[0].message).toMatch(/2024\/01\/15/);
  });
});