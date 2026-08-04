import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  test('SCEN-2631: 商談条件が業務ルール外の値のとき、判定エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidConditions = [
      {
        customerIndustry: '',
        dealAmount: -50000,
        expectedContractDate: '2023-01-01',
        description: 'empty industry, negative amount, past date',
      },
      {
        customerIndustry: 'Technology',
        dealAmount: -100000,
        expectedContractDate: '2024-01-01',
        description: 'negative amount',
      },
      {
        customerIndustry: 'Finance',
        dealAmount: 150000,
        expectedContractDate: '2020-12-31',
        description: 'past contract date',
      },
    ];

    invalidConditions.forEach((condition) => {
      mockAIEngine.evaluatePatternRelevance.mockClear();

      const result = evaluatePatternRelevance(
        {
          customerIndustry: condition.customerIndustry,
          dealAmount: condition.dealAmount,
          expectedContractDate: condition.expectedContractDate,
          successPattern: { patternId: 'SP001', name: 'Standard Approach' },
        },
        mockAIEngine
      );

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('INVALID_BUSINESS_CONDITION');
      expect(result.errorMessage).toBe('商談条件が業務ルール外の値です');
      expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    });
  });
});