import { detectDuplicateAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-640
  test('同一の重複候補データで2回判定実行した場合、同じ結果が返される', () => {
    const duplicate_candidate_input = {
      customer_id_a: 'A001',
      customer_id_b: 'B002',
      duplicate_score: 0.95,
      discrepancy_items: ['phone_number'],
    };

    const first_result = detectDuplicateAndMerge(duplicate_candidate_input);

    const second_result = detectDuplicateAndMerge(duplicate_candidate_input);

    expect(first_result.merge_status).toBe(second_result.merge_status);
    expect(first_result.duplicate_score).toBe(second_result.duplicate_score);
    expect(first_result.duplicate_score).toBe(0.95);
    expect(first_result.recommended_merge_items).toEqual(
      second_result.recommended_merge_items
    );
    expect(first_result.confidence_level).toBe(second_result.confidence_level);
    expect(first_result.confidence_level).toBe('high');
    expect(first_result.merge_status).toBe('merge_recommended');
  });
});