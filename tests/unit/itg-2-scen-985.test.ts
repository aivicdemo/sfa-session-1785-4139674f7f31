import { describe, test, expect, beforeEach } from '@jest/globals';
import * as logicModule from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-985
  test('品質検証結果が0件の場合でも次のアクション判定に進む', () => {
    const purchase_record = {
      sales_id: 'SALES-001',
      transaction_date: '2024-01-15',
      amount: 500000,
      customer_id: 'CUST-12345',
      product_category: 'enterprise_software'
    };

    const quality_check_results: any[] = [];

    const action_judgment_result = logicModule.judgeNextActionWithZeroQualityResults(
      purchase_record,
      quality_check_results
    );

    expect(action_judgment_result).toBeDefined();
    expect(action_judgment_result.judgment_status).toBe('success');
    expect(action_judgment_result.quality_validation_count).toBe(0);
    expect(action_judgment_result.recommended_action).toBeDefined();
    expect(action_judgment_result.error_occurred).toBe(false);
  });
});