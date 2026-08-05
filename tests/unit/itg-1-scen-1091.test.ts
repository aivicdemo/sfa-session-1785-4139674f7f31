import { analyzeActionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析・標準プロセス乖離分析機能', () => {
  // SCEN-1091
  test('営業担当者0人の場合、空の分析結果リストが返される', () => {
    const empty_sales_reps: Array<{
      sales_rep_id: string;
      name: string;
      department: string;
      hire_date: string;
    }> = [];

    const result = analyzeActionPatterns(empty_sales_reps);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});