import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-945
  it('改善優先度スコア算出機能 - 営業担当者IDが null のとき処理がエラーになる', () => {
    const department_id = 'DEPT_001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const sales_person_id = null;
    const issue_frequency = 3;
    const issue_impact_level = 8;

    expect(() =>
      calculateImprovementPriorityScore({
        sales_person_id,
        department_id,
        analysis_period_start,
        analysis_period_end,
        issue_frequency,
        issue_impact_level,
      })
    ).toThrow(/営業担当者ID/);
  });
});