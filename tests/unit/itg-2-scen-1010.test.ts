import { validateProposalValueRange } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1010
  test('提案内容の数値項目が整数の場合に値域検証が成功する', () => {
    const proposalData = {
      proposalAmount: 150000,
      quantity: 10,
      discountRate: 5,
    };

    const validationRules = {
      proposalAmount: { min: 100000, max: 1000000 },
      quantity: { min: 1, max: 999 },
      discountRate: { min: 0, max: 50 },
    };

    const result = validateProposalValueRange(proposalData, validationRules);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.validatedFields).toEqual({
      proposalAmount: true,
      quantity: true,
      discountRate: true,
    });
  });
});