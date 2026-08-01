import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { extractSalesProcessLogRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-075: [error] 営業プロセスログ抽出範囲確定機能 - 対象営業担当者IDが存在しないときエラーとなる
  test('should return ERR_EMPLOYEE_NOT_FOUND when employee ID does not exist', () => {
    const invalid_employee_id = 'INVALID_EMP_999';
    const start_date = '2024-01-01';
    const end_date = '2024-01-31';

    const error_response = extractSalesProcessLogRange({
      employee_id: invalid_employee_id,
      extraction_start_date: start_date,
      extraction_end_date: end_date
    });

    expect(error_response.error_code).toBe('ERR_EMPLOYEE_NOT_FOUND');
    expect(error_response.http_status).toBe(400);
    expect(error_response.error_message).toBe('指定された営業担当者IDが見つかりません');
    expect(error_response.extraction_completed).toBe(false);
  });
});