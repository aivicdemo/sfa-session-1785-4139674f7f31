import { detectAnomalousPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-671
  test('顧客対応記録データが null のとき異常パターン検出処理がエラーになる', () => {
    const null_customer_response_data = null;

    expect(() => {
      detectAnomalousPattern(null_customer_response_data);
    }).toThrow(/顧客対応記録データが null です/);
  });
});