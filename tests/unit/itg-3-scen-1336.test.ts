import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1336
  test('新規案件の顧客条件が0件のとき、マッチング対象なしとして処理される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-12345',
      customerConditions: [],
      dealStage: 'initial_proposal',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    const systemLogs: string[] = [];
    const originalLog = console.log;
    console.log = jest.fn((message: string) => {
      systemLogs.push(message);
      originalLog(message);
    });

    const result = generateRecommendation(
      newDealData,
      mockAIEngine,
    );

    expect(result.recommendationStatus).toBe('NO_MATCHING_PATTERN');
    expect(result.recommendedPatterns).toEqual([]);
    expect(result.message).toContain(
      'マッチング対象となる過去成功パターンが見つかりません。ヒアリング情報を充実させた後、再度推奨を実行してください',
    );
    expect(result.explanation).toBe(null);
    expect(systemLogs.some(log =>
      log.includes('No customer conditions provided - matching skipped'),
    )).toBe(true);

    console.log = originalLog;
  });
});