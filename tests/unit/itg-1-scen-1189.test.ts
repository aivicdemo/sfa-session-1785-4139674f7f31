import { describe, test, expect } from '@jest/globals';
import { analyzeCorrelationWithActualResults } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1189
  test('成約実績データが空配列のときエラーERR_EMPTY_SALES_DATAが発生する', () => {
    const empty_sales_results = [];
    const business_process_data = [
      {
        sales_person_id: 'SP001',
        process_step: 'initial_contact',
        execution_count: 5,
        deviation_from_standard: 0.1,
      },
    ];

    expect(() => {
      analyzeCorrelationWithActualResults(empty_sales_results, business_process_data);
    }).toThrow(/成約実績データが空/);
  });
});