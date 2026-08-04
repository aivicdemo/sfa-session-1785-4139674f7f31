import { generateRecommendationWithValidation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  test('SCEN-953: 顧客IDが空文字列のとき、推奨生成処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const input = {
      customerId: '',
      dealCondition: 'High-priority deal with strategic importance',
      productCategory: 'Enterprise Software',
      budget: 500000,
      decisionTimeline: '2024-Q2',
    };

    const result = generateRecommendationWithValidation(input, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(result.type).toBe('ValidationError');
    expect(result.message).toMatch(/顧客ID/);
    expect(result.message).toMatch(/入力されていません/);
    expect(result.canRetry).toBe(true);
  });
});