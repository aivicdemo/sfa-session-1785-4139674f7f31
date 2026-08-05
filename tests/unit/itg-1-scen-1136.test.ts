import { analyzeRepSalesPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1136
  test('営業担当者IDが欠落しているとき、処理がエラーになること', () => {
    const nullRepIdInput = {
      repId: null,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    };

    expect(() => analyzeRepSalesPerformance(nullRepIdInput)).toThrow(/営業担当者ID/);
  });
});