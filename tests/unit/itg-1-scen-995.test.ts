import { describe, test, expect } from '@jest/globals';
import { judgeApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-995: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - 抽出要因に重複が含まれるとき重複を除外して承認基準判定が実行される
  test('should deduplicate extracted factors and execute approval criteria judgment', () => {
    const extracted_factors_with_duplicates = [
      {
        factor_id: 'f001',
        factor_name: '顧客との信頼関係',
        factor_type: 'success',
        occurrence_count: 3,
        confidence_score: 0.92,
      },
      {
        factor_id: 'f001',
        factor_name: '顧客との信頼関係',
        factor_type: 'success',
        occurrence_count: 3,
        confidence_score: 0.92,
      },
      {
        factor_id: 'f001',
        factor_name: '顧客との信頼関係',
        factor_type: 'success',
        occurrence_count: 3,
        confidence_score: 0.92,
      },
      {
        factor_id: 'f002',
        factor_name: '適切なタイミングでの提案',
        factor_type: 'success',
        occurrence_count: 5,
        confidence_score: 0.88,
      },
      {
        factor_id: 'f003',
        factor_name: '顧客ニーズの深い理解',
        factor_type: 'success',
        occurrence_count: 4,
        confidence_score: 0.85,
      },
      {
        factor_id: 'f002',
        factor_name: '適切なタイミングでの提案',
        factor_type: 'success',
        occurrence_count: 5,
        confidence_score: 0.88,
      },
    ];

    const approval_criteria_threshold = 0.80;

    const result = judgeApprovalCriteria({
      extracted_factors: extracted_factors_with_duplicates,
      approval_threshold: approval_criteria_threshold,
    });

    expect(result).toEqual({
      is_approved: true,
      unique_factor_count: 3,
      approved_factor_count: 3,
      deduplication_applied: true,
      approval_score: expect.any(Number),
      judgment_details: expect.objectContaining({
        total_input_factors: 6,
        deduplicated_factors: 3,
        factors_meeting_criteria: 3,
      }),
    });

    expect(result.unique_factor_count).toBe(3);
    expect(result.approved_factor_count).toBe(3);
    expect(result.deduplication_applied).toBe(true);
    expect(result.is_approved).toBe(true);
  });
});