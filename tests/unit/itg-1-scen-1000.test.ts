import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateSuccessFactorExtractionPreconditions } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1000
  test('成功要因・失敗要因の抽出と承認基準判定機能 - ワークショップ完了日と要因言語化開始日が同日のとき前提条件を満たすと判定される', () => {
    const workshop_completed_date = new Date('2024-01-15T00:00:00Z');
    const factor_verbalization_start_date = new Date('2024-01-15T00:00:00Z');
    const sales_case_id = 'CASE-001';
    const success_factor_text = 'Early customer contact and needs assessment';
    const failure_factor_text = 'Delayed follow-up communication';
    const approval_status = 'pending_approval';
    const data_quality_score = 0.95;

    const result = validateSuccessFactorExtractionPreconditions({
      workshop_completed_date,
      factor_verbalization_start_date,
      sales_case_id,
      success_factor_text,
      failure_factor_text,
      approval_status,
      data_quality_score,
    });

    expect(result.precondition_met).toBe(true);
    expect(result.permitted_to_proceed).toBe(true);
    expect(result.extraction_process_allowed).toBe(true);
  });
});