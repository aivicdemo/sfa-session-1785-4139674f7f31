import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { extractAndApproveSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-971: [error] 成功要因・失敗要因の抽出と承認判定機能 - 抽出された成功要因がnullのとき、処理が進まずエラーになる
  test('should throw error with ERR_SUCCESS_FACTOR_NULL when success factor is null', () => {
    const test_input = {
      project_id: 'TEST-001',
      sales_person_name: '田中太郎',
      project_amount: 5000000,
      success_factor: null,
      failure_factor: {
        cause: '顧客ニーズ不一致',
        related_project_count: 3,
      },
    };

    expect(() => extractAndApproveSuccessFailureFactors(test_input)).toThrow(
      /ERR_SUCCESS_FACTOR_NULL/
    );
  });
});