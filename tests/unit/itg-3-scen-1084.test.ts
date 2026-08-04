import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1084
  test('新規案件の商談IDが空文字列のとき、推奨生成処理がエラーになる', () => {
    const newDealData = {
      dealId: '',
      customerName: 'テスト顧客',
      industry: 'IT',
      budget: 5000000,
      timeline: '2024-12-31',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const result = generateRecommendation(newDealData, mockAIEngine);

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_DEAL_ID',
      errorMessage: '商談IDが空文字列です。新規案件の推奨生成には有効な商談IDが必須です',
      statusCode: 400,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});