import { describe, test, expect } from '@jest/globals';
import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-645: [edge] 顧客情報入力検証機能 - 業種が空文字列のとき、該当項目の修正を促す
  test('should return validation error when industry field is empty string', () => {
    const customerInputData = {
      customerName: 'テスト太郎',
      companyName: 'テスト株式会社',
      industry: '',
      contactEmail: 'test@example.com',
      contactPhone: '09012345678',
      businessScale: '従業員数100-500名'
    };

    const result = validateCustomerInput(customerInputData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'industry',
          message: expect.stringMatching(/業種/)
        })
      ])
    );
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.fieldHighlight).toContain('industry');
    expect(result.preservedData).toEqual({
      customerName: 'テスト太郎',
      companyName: 'テスト株式会社',
      contactEmail: 'test@example.com',
      contactPhone: '09012345678',
      businessScale: '従業員数100-500名'
    });
  });
});