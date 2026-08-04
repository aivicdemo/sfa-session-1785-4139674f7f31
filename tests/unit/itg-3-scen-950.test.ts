import { generateProposalApproachRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  test('SCEN-950: 商談内容が null のとき、推奨生成処理が開始されず警告が返される', () => {
    // AIRecommendationEngine スタブの準備
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    // テスト対象関数の実行
    const result = generateProposalApproachRecommendation(
      {
        customerId: 'CUST-001',
        dealContent: null,
        customerAttributes: {
          industry: 'IT',
          size: 'large',
        },
      },
      mockAIEngine
    );

    // 期待される警告オブジェクト
    const expectedWarning = {
      status: 'warning',
      code: 'INVALID_DEAL_CONTENT',
      message: '商談内容が不足しています。推奨生成を開始できません。',
    };

    // 戻り値が期待される警告オブジェクトと一致することを確認
    expect(result).toEqual(expectedWarning);

    // AIRecommendationEngine.generateRecommendation が呼び出されていないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});