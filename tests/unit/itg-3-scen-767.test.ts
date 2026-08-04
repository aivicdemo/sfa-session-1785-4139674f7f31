import { generateRecommendationWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-767
  test('推奨生成ロジック(AIエージェント失敗時の振る舞い) - 1回目の呼び出しで失敗したとき、1秒後に再試行される', async () => {
    const mockEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('API call failed'))
        .mockResolvedValueOnce({
          recommendation: 'テスト推奨',
          reasoning: 'テスト根拠'
        })
    };

    const testCaseData = {
      customerId: 'cust_001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: '500人以上1000人未満',
      dealTitle: 'システム導入案件',
      dealAmount: 5000000,
      dealStage: '提案段階',
      dealCloseDate: '2026-06-30'
    };

    const resultPromise = generateRecommendationWithRetry(
      mockEngine,
      testCaseData
    );

    // 1秒経過する前の状態を確認
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(mockEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // 1秒経過後の状態を確認
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(mockEngine.generateRecommendation).toHaveBeenCalledTimes(2);

    // 最終的な戻り値を検証
    const result = await resultPromise;
    expect(result).toEqual({
      recommendation: 'テスト推奨',
      reasoning: 'テスト根拠'
    });
  });
});