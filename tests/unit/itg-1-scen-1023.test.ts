import { describe, test, expect } from '@jest/globals';
import { judgeSuccessPatternGuidanceCompleteness } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  // SCEN-1023
  test('[error] 営業部長IDが空文字列のとき報告先の判定がエラーになること', () => {
    const sales_manager_id = '';
    const result = judgeSuccessPatternGuidanceCompleteness({
      sales_manager_id,
    });

    expect(result).toHaveProperty('error_status', true);
    expect(result).toHaveProperty('error_code', 'INVALID_SALES_MANAGER_ID');
    expect(result).toHaveProperty(
      'error_message',
      '営業部長IDが指定されていません'
    );
    expect(result).toHaveProperty('http_status_code', 400);
  });
});