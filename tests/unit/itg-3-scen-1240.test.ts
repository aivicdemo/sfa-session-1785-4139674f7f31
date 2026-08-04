import { executeValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性確認判定機能 - 成功パターン参照エラー', () => {
  // SCEN-1240
  test('参照する成功パターンが存在しないとき、エラーを返す', async () => {
    // 準備: AIRecommendationEngineのスタブを設定
    let callCount = 0;
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(async () => {
        callCount++;
        // 最大3回まで指数バックオフで再試行される想定
        if (callCount < 3) {
          throw new Error('API 一時的な遅延');
        }
        // 3回目以降は空配列を返す
        return [];
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テスト対象への入力パラメータ
    const proposalInput = {
      customerId: 'CUST-001',
      industry: 'IT',
      budget: 5000000,
      challenge: '業務効率化',
      dealCondition: {
        dealId: 'DEAL-001',
        dealStage: 'proposal_phase',
        customerSize: 'mid_market',
      },
    };

    // 関数を呼び出す
    const result = await executeValidation(proposalInput, mockAIRecommendationEngine);

    // 期待結果の検証
    expect(result).toEqual({
      errorType: 'NoSimilarPatternsFoundError',
      message: '参照する成功パターンが見つかりません',
      errorCode: 'ERR_PATTERN_NOT_FOUND',
      httpStatusCode: 400,
    });

    // AIRecommendationEngineの外部呼び出しが最大3回まで指数バックオフで再試行されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);

    // 呼び出し履歴から再試行間隔を確認（指数バックオフ: 1秒、2秒）
    // 1回目: 即座、2回目: 1秒後、3回目: 2秒後
    const callTimes = mockAIRecommendationEngine.findSimilarPatterns.mock.invocationCallOrder;
    expect(callTimes.length).toBe(3);
  });
});