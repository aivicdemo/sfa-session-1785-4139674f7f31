import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨送信準備機能 - 外部AI推奨エンジン失敗時の代替表示', () => {
  test('SCEN-630: 外部AIエンジン失敗時、キャッシュされた過去推奨が代替表示される', async () => {
    // スタブ: AIRecommendationEngine - タイムアウト例外を発生させる
    const aiEngineStub = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockRejectedValueOnce(new Error('Request timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // スタブ: 推奨パターンマスタデータベース - 過去推奨データを登録
    const cachedRecommendationPattern = {
      patternId: 'PAST-001',
      recommendationContent: '段階的導入提案',
      successRate: 78,
      industryType: '製造業',
      budgetRange: '500万円',
      adoptionPeriod: '3ヶ月',
    };

    // スタブ: キャッシュ取得関数
    const cacheGetterStub = jest.fn().mockReturnValue(cachedRecommendationPattern);

    // 新規案件データ
    const newDealInput = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      implementationMonths: 3,
    };

    // 実行
    const result = await generateRecommendationWithFallback(
      newDealInput,
      aiEngineStub,
      cacheGetterStub,
    );

    // 検証: AIエンジン呼び出しが3回実行されたことを確認（指数バックオフの再試行）
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // 検証: キャッシュから過去推奨を取得したことを確認
    expect(cacheGetterStub).toHaveBeenCalledWith({
      customerIndustry: '製造業',
      budgetRange: 5000000,
    });

    // 検証: ユーザーメッセージが正しく返される
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    // 検証: 代替表示された推奨内容が過去推奨データと一致
    expect(result.recommendationContent).toBe('段階的導入提案');
    expect(result.successRate).toBe(78);

    // 検証: 根拠説明が簡略版で表示される
    expect(result.reasoningExplanation).toBe(
      '過去の類似案件における成功パターン（成功率78%）に基づいた推奨です',
    );

    // 検証: 詳細な根拠生成が行われないことを確認
    expect(result.detailedReasoning).toBeUndefined();

    // 検証: フォールバックフラグが設定されている
    expect(result.isFallback).toBe(true);
  });
});