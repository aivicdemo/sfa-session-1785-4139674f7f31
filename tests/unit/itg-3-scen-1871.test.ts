import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1871
  test('推奨の生成に使用された商談条件が空のとき根拠表示に失敗する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValueOnce({
        recommendedApproach: 'テレマーケティング',
        dealConditions: {},
        successPatternId: 'SP-001',
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockRejectedValueOnce(
          new Error('商談条件が不足しています'),
        )
        .mockRejectedValueOnce(
          new Error('商談条件が不足しています'),
        )
        .mockRejectedValueOnce(
          new Error('商談条件が不足しています'),
        ),
    };

    const mockSuccessPatternMaster = [
      {
        patternId: 'SP-001',
        approach: '顧客訪問による提案',
        successRate: 85,
        briefReasoning: '直接対面により信頼構築が可能',
      },
      {
        patternId: 'SP-002',
        approach: 'メールによる事例紹介',
        successRate: 72,
        briefReasoning: '参考事例の提供により検討促進',
      },
      {
        patternId: 'SP-003',
        approach: 'セミナー参加型提案',
        successRate: 68,
        briefReasoning: '業界最新情報の共有と信頼向上',
      },
    ];

    const result = await explainRecommendationReasoning(
      { recommendationId: 'REC-123', dealConditions: {} },
      mockAIEngine,
      mockSuccessPatternMaster,
    );

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    expect(result.fallbackPatterns).toEqual([
      {
        patternId: 'SP-001',
        approach: '顧客訪問による提案',
        briefReasoning: '直接対面により信頼構築が可能',
      },
      {
        patternId: 'SP-002',
        approach: 'メールによる事例紹介',
        briefReasoning: '参考事例の提供により検討促進',
      },
      {
        patternId: 'SP-003',
        approach: 'セミナー参加型提案',
        briefReasoning: '業界最新情報の共有と信頼向上',
      },
    ]);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      3,
    );

    const callArgs = mockAIEngine.explainRecommendationReasoning.mock.calls.map(
      (call: any[]) => call[0],
    );
    expect(callArgs[0]).toEqual({ recommendationId: 'REC-123', dealConditions: {} });
    expect(callArgs[1]).toEqual({ recommendationId: 'REC-123', dealConditions: {} });
    expect(callArgs[2]).toEqual({ recommendationId: 'REC-123', dealConditions: {} });

    expect(result.retryLog).toEqual({
      attempt1: { delayMs: 1000, status: 'failed' },
      attempt2: { delayMs: 2000, status: 'failed' },
      attempt3: { delayMs: 4000, status: 'failed' },
    });
  });
});