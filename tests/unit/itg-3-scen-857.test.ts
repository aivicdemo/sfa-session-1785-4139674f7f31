import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-857: 根拠データのタイムスタンプが null のとき、エラーで処理が進まない', () => {
    const mockRecommendationPattern = {
      patternId: 'PAT-001',
      customerId: 'CUST-12345',
      dealCondition: {
        industryType: 'IT',
        companySize: 'medium',
        dealStage: 'proposal',
      },
      recommendationContent: '提案アプローチ: デジタル変革支援',
      confidenceScore: null,
      evidenceDataList: [
        {
          evidenceId: 'EV-001',
          sourceType: 'past_success_case',
          dataContent: '類似顧客事例: ABC株式会社',
          timestamp: null,
        },
      ],
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() => {
      evaluatePatternRelevance(mockRecommendationPattern);
    }).toThrow(/タイムスタンプ/);
  });
});