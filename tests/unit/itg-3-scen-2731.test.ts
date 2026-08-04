import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック - 顧客制約条件と推奨提案内容の矛盾検出', () => {
  // SCEN-2731
  test('顧客制約条件と推奨提案内容が矛盾するとき処理が失敗する', () => {
    const customerConstraints = {
      budgetLimit: 5000000,
      implementationPeriodMonths: 3,
      targetRegion: '東日本のみ',
      requiredFeatures: ['リアルタイム集計機能'],
    };

    const recommendedProposal = {
      targetRegion: '西日本',
      implementationPeriodMonths: 6,
      budget: 10000000,
      requiredFeatures: [],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error(
          'CONSTRAINT_CONFLICT: 推奨提案内容が顧客制約条件と矛盾しています。対応地域（推奨：西日本 vs 制約：東日本のみ）、導入期間（推奨：6ヶ月 vs 制約：3ヶ月以内）、予算（推奨：1000万円 vs 制約：500万円）、必須機能の有無（推奨：なし vs 制約：必須）'
        );
      }),
    };

    expect(() =>
      generateRecommendation(customerConstraints, recommendedProposal, mockAIEngine)
    ).toThrow(/矛盾/);
  });
});