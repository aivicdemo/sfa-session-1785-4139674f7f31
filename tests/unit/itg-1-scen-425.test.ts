import { standardizeCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-425
  test('顧客反応の分類パターンが null のとき、エラーが発生する', () => {
    const invalid_input = {
      classificationPattern: null,
      responseText: '提案に興味がある',
      responseTimestamp: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() => standardizeCustomerResponse(invalid_input)).toThrow(
      /分類パターン|classificationPattern/
    );

    try {
      standardizeCustomerResponse(invalid_input);
      fail('Expected error to be thrown');
    } catch (error: unknown) {
      const err = error as { code?: string; message: string };
      expect(err.message).toMatch(/分類パターン|classificationPattern/);
      expect(err.code).toBe('ERR_INVALID_CLASSIFICATION_PATTERN');
    }
  });
});