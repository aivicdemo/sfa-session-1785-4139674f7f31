import { calculateSalesPersonComplianceCompletion } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-1026: チーム全体の周知完了判定時に営業担当者データが0件のときエラーになること', () => {
    // 入力: 営業担当者リストが空配列
    const salesPersonList: any[] = [];
    
    // 実行: チーム全体の周知完了判定処理を実行
    const result = calculateSalesPersonComplianceCompletion(salesPersonList);
    
    // 検証1: ステータスコードが400番台であること
    expect(result.statusCode).toBeGreaterThanOrEqual(400);
    expect(result.statusCode).toBeLessThan(500);
    
    // 検証2: エラーメッセージに業務的に妥当なキーワードが含まれていること
    expect(result.errorMessage).toMatch(/営業担当者|周知完了判定対象|0件|存在しません/);
  });
});