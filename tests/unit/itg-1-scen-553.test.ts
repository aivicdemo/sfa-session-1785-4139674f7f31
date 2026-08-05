import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-553: [error] 営業担当者ごとの行動パターン分析レポート生成機能 - 成約実績の営業担当者IDが欠落している場合、エラーになる
  test('成約実績レコードの営業担当者IDが欠落している場合、SALES_PERSON_ID_REQUIREDエラーをスローする', () => {
    const contract_result_id = 'contract_result_001';
    const sales_person_id_null = null;
    const customer_id = 'customer_001';
    const contract_amount = 500000;
    const contract_date = '2024-01-15';
    const status = 'completed';

    const contract_result_with_missing_id = {
      contract_result_id: contract_result_id,
      sales_person_id: sales_person_id_null,
      customer_id: customer_id,
      contract_amount: contract_amount,
      contract_date: contract_date,
      status: status
    };

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        contract_result_record: contract_result_with_missing_id
      })
    ).toThrow(/営業担当者ID/);
  });
});