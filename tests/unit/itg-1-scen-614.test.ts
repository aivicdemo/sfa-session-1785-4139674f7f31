import { analyzeSellerBehaviorAndResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-614
  test('顧客対応パターンデータが欠落しているときエラーになる', () => {
    const sellerId = 'seller_001';
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';
    const customerPatternData = null;
    const contractResultsData = [
      {
        contractId: 'contract_001',
        sellerId: 'seller_001',
        customerId: 'customer_001',
        contractAmount: 500000,
        contractDate: '2024-01-15',
        status: 'completed'
      }
    ];

    const input = {
      sellerId,
      analysisStartDate,
      analysisEndDate,
      customerPatternData,
      contractResultsData
    };

    expect(() => analyzeSellerBehaviorAndResults(input)).toThrow(/顧客対応パターンデータ/);
  });
});