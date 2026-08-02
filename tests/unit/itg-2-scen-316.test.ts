import { decidePriorityForImprovement } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-316: 改善指導優先順位の決定 - スコアが同値である複数営業担当者のとき、営業担当者IDの字句順でソートして優先度が付与される', () => {
    const sales_representatives = [
      { emp_id: 'EMP003', compliance_score: 85 },
      { emp_id: 'EMP001', compliance_score: 85 },
      { emp_id: 'EMP002', compliance_score: 85 }
    ];

    const result = decidePriorityForImprovement(sales_representatives);

    expect(result).toEqual([
      { emp_id: 'EMP001', compliance_score: 85, priority: 1 },
      { emp_id: 'EMP002', compliance_score: 85, priority: 2 },
      { emp_id: 'EMP003', compliance_score: 85, priority: 3 }
    ]);
  });
});