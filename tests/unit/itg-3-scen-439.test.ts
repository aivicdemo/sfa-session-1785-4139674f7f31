import { evaluateCustomerDataQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 顧客マスタ品質評価', () => {
  // SCEN-439
  test('顧客マスタのエラー件数が1件の場合、スコアが正しく減点される', () => {
    // 準備：エラー1件（顧客名が欠落）を含む顧客レコード
    const customerRecordsWithOneError = [
      {
        customerId: 'CUST001',
        customerName: '',
        industry: 'Manufacturing',
        scale: 'Large',
        contactEmail: 'contact@example.com',
        phone: '090-1234-5678',
        status: 'Active',
      },
    ];

    // 実行：品質評価ロジックを実行
    const result = evaluateCustomerDataQuality(customerRecordsWithOneError);

    // 検証：スコアが95点（100 - 5*1件 = 95）であること
    expect(result.qualityScore).toBe(95);

    // 検証：エラー件数が1件であること
    expect(result.errorCount).toBe(1);

    // 検証：減点内訳にエラー内容と理由が記録されていること
    expect(result.deductionDetails).toContainEqual(
      expect.objectContaining({
        errorType: 'Missing Required Field',
        fieldName: 'customerName',
        deductionPoints: 5,
        reason: '顧客名が未設定',
      })
    );

    // 検証：スコア計算根拠が記録されていること
    expect(result.scoringBasis).toEqual(
      expect.objectContaining({
        baseScore: 100,
        totalDeduction: 5,
        errorDetails: expect.any(Array),
      })
    );
  });
});