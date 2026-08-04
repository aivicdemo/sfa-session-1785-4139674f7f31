import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  test('SCEN-2527: 成功要因リストが空のとき、空配列として処理される', () => {
    const inputData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      successFactorsList: [],
      dealConditions: {
        industryType: 'IT',
        companySize: 'large',
        dealAmount: 5000000,
      },
    };

    const result = extractAndStructureSuccessPatterns(inputData);

    expect(result.successPatterns).toEqual([]);
    expect(result.error).toBeNull();
    expect(result.status).toBe('success');
  });
});