import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン推奨機能', () => {
  // SCEN-1021
  test('AIエージェント呼び出し時のリトライ処理 - OpenAI API初回呼び出し失敗時、1秒後に再試行される', async () => {
    jest.useFakeTimers();

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST_001',
      customerIndustry: 'IT',
      customerScale: 'large',
      dealStage: 'proposal',
      dealAmount: 5000000,
      dealTimeline: '2024-03-31',
    };

    const successResponse = {
      recommendedApproach: 'Enterprise Solution Strategy',
      approachDescription: 'Focus on scalability and cost optimization',
      confidenceScore: 85,
      reasoning: [
        'Similar pattern found in 3 past successful deals',
        'Industry vertical match with established success rate',
      ],
      riskFactors: ['Tight timeline', 'Budget constraints'],
    };

    // 初回呼び出しでネットワークタイムアウトエラーを発生させる
    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('Network timeout')
    );

    // 2回目の呼び出しで成功レスポンスを返す
    mockAIEngine.generateRecommendation.mockResolvedValueOnce(successResponse);

    // generateRecommendationメソッドを呼び出す
    const resultPromise = generateRecommendation(newDealData, mockAIEngine);

    // 初回API呼び出しが失敗することを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealData);

    // 1秒（1000ミリ秒）経過させて再試行をトリガー
    jest.advanceTimersByTime(1000);

    // 結果を待つ
    const result = await resultPromise;

    // 再試行時にモックが成功レスポンスを返し、推奨結果が正常に返却されることを確認
    expect(result).toEqual({
      recommendedApproach: 'Enterprise Solution Strategy',
      approachDescription: 'Focus on scalability and cost optimization',
      confidenceScore: 85,
      reasoning: [
        'Similar pattern found in 3 past successful deals',
        'Industry vertical match with established success rate',
      ],
      riskFactors: ['Tight timeline', 'Budget constraints'],
    });

    // スタブの呼び出し回数が2回であることを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.generateRecommendation).toHaveBeenNthCalledWith(
      2,
      newDealData
    );

    jest.useRealTimers();
  });
});