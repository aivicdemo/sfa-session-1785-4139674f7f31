import { determineSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-074
  test('営業プロセスログ抽出範囲確定機能 - 対象営業担当者に重複を含むとき重複を除去して範囲が確定される', () => {
    const input_sales_representatives = ['営業太郎', '営業花子', '営業太郎', '営業次郎', '営業花子'];
    
    const result = determineSalesProcessLogExtractionRange(input_sales_representatives);
    
    const expected_confirmed_representatives = ['営業太郎', '営業花子', '営業次郎'];
    
    expect(result).toEqual(expected_confirmed_representatives);
    
    const unique_count = new Set(result).size;
    expect(unique_count).toBe(result.length);
  });
});