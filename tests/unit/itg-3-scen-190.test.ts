import { getRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - キャッシュ管理', () => {
  test('SCEN-190: 推奨内容キャッシュ管理機能 - AIエージェント呼び出し失敗時に過去推奨履歴が複数件である場合に最新順で1件が取得される', async () => {
    // キャッシュ初期化
    const recommendationCache: Array<{
      customerId: string;
      timestamp: string;
      content: string;
      source: string;
    }> = [];

    // 過去推奨履歴3件をキャッシュに保存
    recommendationCache.push({
      customerId: 'CUST-001',
      timestamp: '2026-01-01T10:00:00Z',
      content: '提案A',
      source: 'キャッシュ'
    });
    recommendationCache.push({
      customerId: 'CUST-001',
      timestamp: '2026-01-02T14:30:00Z',
      content: '提案B',
      source: 'キャッシュ'
    });
    recommendationCache.push({
      customerId: 'CUST-001',
      timestamp: '2026-01-03T09:15:00Z',
      content: '提案C',
      source: 'キャッシュ'
    });

    // AIRecommendationEngineをスタブ化
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('API呼び出し失敗')
      )
    };

    // 新規案件の推奨生成リクエスト
    const dealCondition = {
      customerId: 'CUST-001',
      dealCondition: 'X'
    };

    // 3回の指数バックオフ再試行を含めた実行
    const result = await getRecommendationWithFallback(
      dealCondition,
      mockAIEngine,
      recommendationCache
    );

    // AIRecommendationEngine呼び出しが3回の再試行後に失敗したことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(4); // 初回 + 3回の再試行

    // キャッシュから最新の推奨が取得されたことを検証
    expect(result).toEqual({
      customerId: 'CUST-001',
      timestamp: '2026-01-03T09:15:00Z',
      content: '提案C',
      source: 'キャッシュ'
    });

    // 返却される推奨オブジェクトが正確な内容を含むことを確認
    expect(result.content).toBe('提案C');
    expect(result.timestamp).toBe('2026-01-03T09:15:00Z');
    expect(result.source).toBe('キャッシュ');
  });
});