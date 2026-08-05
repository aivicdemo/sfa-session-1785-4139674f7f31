import { describe, test, expect, beforeEach } from '@jest/globals';
import { determineSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-107
  test('営業部長情報が null のときエラーになる', () => {
    const input = {
      sales_manager_info: null,
      extraction_start_date: '2024-01-01',
      extraction_end_date: '2024-01-31',
      target_sales_representatives: ['SR001', 'SR002'],
      extraction_reason: 'Monthly data accumulation check',
    };

    expect(() => determineSalesProcessLogExtractionRange(input)).toThrow(/営業部長/);
  });
});