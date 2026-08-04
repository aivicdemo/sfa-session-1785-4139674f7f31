import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  // SCEN-1593
  test('商談条件に必須フィールドが複数欠けているとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const dealCondition = {
      productCategory: '営業支援ツール',
      budgetScale: 5000000,
    };

    expect(() =>
      generateRecommendation(dealCondition, mockAIEngine)
    ).toThrow(/顧客ID/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});