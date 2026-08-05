import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateCustomerIdForSuccessPatternMatrixApplication } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能 - 成功パターンマトリクス適用判定', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-386
  test('顧客IDがnullのときエラーハンドリングにより処理が中断される', () => {
    const input_customer_id = null;
    const input_pattern_matrix = {
      pattern_id: 'pattern_001',
      customer_segment: 'corporate',
      product_category: 'solution_a',
      success_rate: 0.85,
    };
    const input_approval_threshold = 0.80;

    expect(() =>
      validateCustomerIdForSuccessPatternMatrixApplication(
        input_customer_id,
        input_pattern_matrix,
        input_approval_threshold
      )
    ).toThrow(/顧客ID/);
  });
});