import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  test('SCEN-2130: 新規案件IDが空文字列のとき、バリデーションエラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const newProjectId = '';
    const customerName = 'テスト顧客株式会社';
    const industry = 'IT';
    const companySize = 'large';
    const dealCondition = {
      budget: 1000000,
      timeline: '2024-Q2',
      decisionMaker: 'CTO',
    };

    expect(() =>
      generateRecommendation(
        newProjectId,
        customerName,
        industry,
        companySize,
        dealCondition,
        mockAIEngine
      )
    ).toThrow(/新規案件ID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});