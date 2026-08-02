import { describe, test, expect, beforeEach } from '@jest/globals';
import { judgeConsolidationEligibility } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1186
  test('同じ入力データで統合判定を2回実行した場合、両回とも同じ統合結果が返される', () => {
    const customer_data = {
      customer_name: '株式会社テスト',
      address: '東京都渋谷区1-1-1',
      phone_number: '03-1234-5678',
      email_address: 'test@example.com',
    };

    const first_result = judgeConsolidationEligibility(customer_data);

    const second_result = judgeConsolidationEligibility(customer_data);

    expect(first_result.consolidation_judgment_id).toBe(
      second_result.consolidation_judgment_id
    );

    expect(first_result.matching_target_customer_ids).toEqual(
      second_result.matching_target_customer_ids
    );

    expect(first_result.consolidation_possible_flag).toBe(
      second_result.consolidation_possible_flag
    );

    expect(first_result.confidence_score).toBe(
      second_result.confidence_score
    );
  });
});