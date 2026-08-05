import { validateSalesPersonId } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用ガイドライン周知完了判定機能', () => {
  test('SCEN-1017: 営業担当者IDが0のとき処理がエラーになること', () => {
    const invalid_sales_person_id = 0;

    const result = validateSalesPersonId(invalid_sales_person_id);

    expect(result.is_error).toBe(true);
    expect(result.error_code).toBe('INVALID_SALES_PERSON_ID');
    expect(result.error_message).toMatch(/営業担当者ID/);
  });
});