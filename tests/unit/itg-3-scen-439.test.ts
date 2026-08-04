import { evaluateCustomerMasterQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 顧客マスタ品質評価', () => {
  // SCEN-439
  test('顧客マスタのエラー件数が1件の場合、スコアが正しく減点される', () => {
    const customerRecords = [
      {
        customerId: 'CUST-001',
        customerName: '',
        industry: 'Manufacturing',
        scale: 'Large',
        registrationDate: '2024-01-15',
        lastContactDate: '2024-08-01',
      },
      {
        customerId: 'CUST-002',
        customerName: 'ABC Corporation',
        industry: 'Finance',
        scale: 'Medium',
        registrationDate: '2024-02-20',
        lastContactDate: '2024-08-02',
      },
    ];

    const result = evaluateCustomerMasterQuality(customerRecords);

    expect(result.qualityScore).toBe(95);
    expect(result.errorCount).toBe(1);
    expect(result.deductionAmount).toBe(5);
    expect(result.baseScore).toBe(100);
    expect(result.errorDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customerId: 'CUST-001',
          errorContent: '顧客名が未設定',
          deductionReason: '必須項目（顧客名）が空値のため、データ品質基準に不適合',
        }),
      ])
    );
    expect(result.calculationBasis).toContain('エラー件数1件');
    expect(result.calculationBasis).toContain('減点5点');
  });
});