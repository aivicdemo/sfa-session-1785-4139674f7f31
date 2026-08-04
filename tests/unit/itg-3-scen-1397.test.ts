import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1397: 提案内容と顧客制約条件の自動照合機能 - 提案内容が1件のとき、照合が実行される', async () => {
    // テストデータ: 顧客制約条件
    const customerConstraint = {
      customerId: 'CUST-001',
      budgetLimitYen: 5000000,
      implementationPeriodMonths: 3,
      supportedOSList: ['Windows10', 'Windows11']
    };

    // テストデータ: 提案内容
    const proposalContent = {
      proposalId: 'PROP-001',
      proposalAmountYen: 4500000,
      implementationPeriodMonths: 2,
      targetOSList: ['Windows10', 'Windows11']
    };

    // AIRecommendationEngineをモック化
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        proposalId: 'PROP-001',
        customerId: 'CUST-001',
        recommendationScore: 95,
        reasoning: '提案内容は顧客制約条件をすべて満たす優れた推奨'
      })
    };

    // 照合処理の入力
    const matchingInput = {
      customerConstraint: customerConstraint,
      proposalContentList: [proposalContent],
      aiEngine: mockAIRecommendationEngine
    };

    // 照合処理を実行
    const result = await generateRecommendation(matchingInput);

    // AIエンジンが1回呼び出されたことを検証
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // 予算制約の適合性を検証
    expect(result.matchingResults[0].budgetCompatibility).toEqual({
      isCompatible: true,
      proposalAmount: 4500000,
      budgetLimit: 5000000,
      message: '適合（450万円 ≤ 500万円上限）'
    });

    // 導入期間制約の適合性を検証
    expect(result.matchingResults[0].implementationPeriodCompatibility).toEqual({
      isCompatible: true,
      proposalPeriod: 2,
      maxPeriod: 3,
      message: '適合（2ヶ月 ≤ 3ヶ月以内）'
    });

    // OS制約の適合性を検証
    expect(result.matchingResults[0].osCompatibility).toEqual({
      isCompatible: true,
      proposalOS: ['Windows10', 'Windows11'],
      supportedOS: ['Windows10', 'Windows11'],
      message: '適合（Windows10/11は要件を満たす）'
    });

    // 照合ステータスを検証
    expect(result.matchingStatus).toBe('完了');

    // 全体の照合結果が成功したことを検証
    expect(result.overallMatch).toBe(true);
    expect(result.recommendationScore).toBe(95);
  });
});