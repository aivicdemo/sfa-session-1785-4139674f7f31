import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-1928
  test('推奨根拠の可視化機能 - AIエージェント失敗時に内部推奨パターンマスタから統計上位の根拠が返却される', async () => {
    // 推奨パターンマスタデータ
    const recommendationPatterns = [
      {
        patternId: 'pattern_a',
        successRate: 0.78,
        occurrenceCount: 156,
        description: 'パターンA',
        weight: 0.78 * 156,
      },
      {
        patternId: 'pattern_b',
        successRate: 0.72,
        occurrenceCount: 89,
        description: 'パターンB',
        weight: 0.72 * 89,
      },
      {
        patternId: 'pattern_c',
        successRate: 0.65,
        occurrenceCount: 42,
        description: 'パターンC',
        weight: 0.65 * 42,
      },
    ];

    // AIエージェント呼び出し失敗のシミュレーション（3回の再試行後にタイムアウト）
    const aiEngineStub = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('API timeout after 30 seconds')),
    };

    // 新規案件データ
    const newCasData = {
      customerId: 'cust_12345',
      industryType: '製造業',
      budgetAmount: 5000000,
      decisionMakerCount: 3,
    };

    // 推奨生成API実行
    const result = await generateRecommendationWithFallback(
      newCasData,
      aiEngineStub,
      recommendationPatterns,
    );

    // 期待結果の検証

    // (1) 推奨パターンとしてパターンA（成功率78%）が第1位として返却されている
    expect(result.recommendedPattern.patternId).toBe('pattern_a');
    expect(result.recommendedPattern.successRate).toBe(0.78);

    // (2) 根拠説明は簡略版で、定型文である
    expect(result.rationale).toBe(
      '過去の統計データから成功率が高いパターンを推奨しています',
    );

    // (3) 推奨の信頼度スコアは外部AI不使用であることを示す低値（0.6以下）である
    expect(result.confidenceScore).toBeLessThanOrEqual(0.6);
    expect(result.confidenceScore).toBeGreaterThan(0);

    // (4) UIメッセージが正しく返却される
    expect(result.uiMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    // 指数バックオフ再試行の実行確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(4);

    // フォールバック処理が実行されたことを確認
    expect(result.isFallback).toBe(true);
  });
});