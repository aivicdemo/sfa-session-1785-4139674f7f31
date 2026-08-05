import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { determineLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-102
  it('営業部長の承認ステータスが未完了のときエラーになる', () => {
    const input_start_date = '2024-01-01';
    const input_end_date = '2024-01-31';
    const approval_status = 'incomplete';
    const division_head_name = '営業部長';

    expect(() => {
      determineLogExtractionRange({
        start_date: input_start_date,
        end_date: input_end_date,
        approval_status: approval_status,
      });
    }).toThrow(/営業部長の承認/);
  });
});