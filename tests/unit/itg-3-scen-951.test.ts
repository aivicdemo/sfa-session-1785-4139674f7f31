import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  test('SCEN-951: 商談内容が空オブジェクトのとき、推奨生成処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const emptyDealData = {};

    const result = generateRecommendation(emptyDealData, mockAIEngine);

    expect(result).toEqual({
      errorCode: 'INVALID_DEAL_DATA',
      message: '商談内容が空です。顧客名、商談ステージ、商材等の必須項目が不足しています',
      status: 400,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});