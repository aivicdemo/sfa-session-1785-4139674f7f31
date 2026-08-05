import { extractSalesProcessLogRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-105
  test('対象営業担当者の ID が無効なときエラーになる', () => {
    const invalidSalespersonId = 'invalid_id_12345';
    const extractionStartDate = new Date('2024-01-01T00:00:00Z');
    const extractionEndDate = new Date('2024-01-31T23:59:59Z');

    const result = extractSalesProcessLogRange({
      salesperson_id: invalidSalespersonId,
      start_date: extractionStartDate,
      end_date: extractionEndDate,
    });

    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('ERR_INVALID_SALESPERSON_ID');
    expect(result.error?.message).toBe('指定された営業担当者IDが見つかりません');
    expect(result.extraction_range).toBeUndefined();
    expect(result.logs_extracted).toBe(0);
  });
});