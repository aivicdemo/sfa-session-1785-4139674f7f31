import { detectAnomalousPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-672
  test('顧客対応記録データが空配列のとき異常パターン検出処理がエラーになる', () => {
    const emptyCustomerRecords: any[] = [];
    const analysisContext = {
      standardProcessSteps: ['初回接触', '提案', '交渉', '成約'],
      successPatterns: [
        {
          patternId: 'SP001',
          contactFrequency: 3,
          proposalSuccessRate: 0.8,
          followUpInterval: 7,
        },
      ],
    };

    let caughtError: any = null;

    try {
      detectAnomalousPatterns(emptyCustomerRecords, analysisContext);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).not.toBeNull();
    expect(caughtError.message).toBe('顧客対応記録が存在しません');
    expect(caughtError.code).toBe('ERR_EMPTY_CUSTOMER_RECORDS');
    expect(caughtError).toBeInstanceOf(TypeError);
  });
});