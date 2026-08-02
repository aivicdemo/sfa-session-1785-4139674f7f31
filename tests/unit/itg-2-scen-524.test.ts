import { determineDuplicateAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-524
  test('同じ入力で2回実行したとき、同じ統合判定結果が得られる', () => {
    const customer_data = {
      customer_name: '山田太郎',
      email_address: 'yamada@example.com',
      phone_number: '09012345678',
    };

    const first_result = determineDuplicateAndMerge(customer_data);
    const second_result = determineDuplicateAndMerge(customer_data);

    expect(first_result.judgment_result_code).toBe(second_result.judgment_result_code);
    expect(first_result.match_score).toBe(second_result.match_score);
    expect(first_result.recommended_action).toBe(second_result.recommended_action);
    expect(first_result.merge_target_flag).toBe(second_result.merge_target_flag);
    expect(first_result.confidence_score).toBe(second_result.confidence_score);

    expect(first_result.judgment_result_code).toBe('DUPLICATE_DETECTED');
    expect(first_result.match_score).toBe(0.95);
    expect(first_result.recommended_action).toBe('MERGE_RECOMMENDED');
    expect(first_result.merge_target_flag).toBe(true);
    expect(first_result.confidence_score).toBe(0.95);
  });
});