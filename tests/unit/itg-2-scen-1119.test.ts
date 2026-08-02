import { validateCaseDataFormat } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1119
  test('事例データの数値フィールドが非数値である場合、形式検証に不合格となる', () => {
    const caseData = {
      caseId: 'CASE001',
      customerName: '顧客A',
      salesAmount: 'abc',
      dealDate: '2024-01-15',
      dealStatus: '成約',
    };

    const result = validateCaseDataFormat(caseData);

    expect(result.status).toBe('不合格');
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INVALID_NUMERIC_FORMAT',
          message: '売上金額フィールドは数値である必要があります',
        }),
      ])
    );
  });
});