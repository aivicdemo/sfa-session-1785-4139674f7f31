import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨生成キャッシュ代替機能', () => {
  test('SCEN-1164: 外部AIタイムアウト時にキャッシュから最新推奨順に代替候補を提示', async () => {
    const mockAiEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('API timeout exceeded 30s')), 31000);
          })
      ),
    };

    const cachedRecommendations = [
      {
        id: 'rec-a',
        customerId: 'cust-001',
        dealId: 'deal-001',
        content: '提案アプローチA：顧客スケール向け高機能プラン',
        credibilityScore: 92,
        timestamp: new Date('2024-01-15T14:30:00Z'),
      },
      {
        id: 'rec-b',
        customerId: 'cust-001',
        dealId: 'deal-001',
        content: '提案アプローチB：段階的導入プラン',
        credibilityScore: 85,
        timestamp: new Date('2024-01-14T10:15:00Z'),
      },
      {
        id: 'rec-c',
        customerId: 'cust-001',
        dealId: 'deal-001',
        content: '提案アプローチC：基本プラン＋カスタマイズ',
        credibilityScore: 78,
        timestamp: new Date('2024-01-13T09:00:00Z'),
      },
    ];

    const successPatternMaster = [
      {
        patternId: 'pat-001',
        industryType: '製造業',
        companyScale: '大企業',
        issuePattern: 'デジタル変革',
        successRate: 0.87,
        recommendationCount: 156,
      },
      {
        patternId: 'pat-002',
        industryType: '製造業',
        companyScale: '大企業',
        issuePattern: 'コスト削減',
        successRate: 0.82,
        recommendationCount: 134,
      },
      {
        patternId: 'pat-003',
        industryType: '製造業',
        companyScale: '中堅企業',
        issuePattern: 'デジタル変革',
        successRate: 0.79,
        recommendationCount: 98,
      },
    ];

    const customerCondition = {
      customerId: 'cust-001',
      industry: '製造業',
      scale: '大企業',
      currentChallenge: 'デジタル変革',
    };

    const dealCondition = {
      dealId: 'deal-001',
      dealValue: 5000000,
      dealStage: '初期提案準備',
      expectedCloseDate: new Date('2024-03-31T23:59:59Z'),
    };

    const result = await generateRecommendation(
      { customerCondition, dealCondition },
      mockAiEngine,
      cachedRecommendations,
      successPatternMaster
    );

    expect(mockAiEngine.generateRecommendation).toHaveBeenCalled();

    expect(result.isCacheFallback).toBe(true);
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.alternativeCandidates).toHaveLength(3);
    expect(result.alternativeCandidates[0].id).toBe('rec-a');
    expect(result.alternativeCandidates[0].timestamp).toEqual(
      new Date('2024-01-15T14:30:00Z')
    );
    expect(result.alternativeCandidates[1].id).toBe('rec-b');
    expect(result.alternativeCandidates[1].timestamp).toEqual(
      new Date('2024-01-14T10:15:00Z')
    );
    expect(result.alternativeCandidates[2].id).toBe('rec-c');
    expect(result.alternativeCandidates[2].timestamp).toEqual(
      new Date('2024-01-13T09:00:00Z')
    );

    const timestamps = result.alternativeCandidates.map((rec) => rec.timestamp.getTime());
    const sortedTimestamps = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sortedTimestamps);

    expect(result.retryAttempts).toBe(3);
    expect(result.retryDelays).toEqual([1000, 2000, 4000]);
  });
});