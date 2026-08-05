import { analyzeExecutionPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-610
  test('営業担当者IDが欠落しているときエラーになる', () => {
    const invalid_sales_person_ids = [null, undefined, ''];

    for (const invalid_id of invalid_sales_person_ids) {
      expect(() =>
        analyzeExecutionPerformance({
          sales_person_id: invalid_id as any,
          analysis_start_date: '2024-01-01',
          analysis_end_date: '2024-01-31',
        })
      ).toThrow(/営業担当者ID/);
    }
  });
});