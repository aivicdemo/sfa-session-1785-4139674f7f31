import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨する機能', () => {
  // SCEN-2403
  test('AIRecommendationEngineの外部API呼び出しが失敗したとき、代替ロジックが実行され、簡略版の精度スコアが返される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    let callCount = 0;
    mockAIRecommendationEngine.generateRecommendation.mockImplementation(() => {
      callCount++;
      const error = new Error('Network error: ECONNREFUSED');
      (error as any).code = 'ECONNREFUSED';
      throw error;
    });

    const inputData = {
      customerId: 'CUST-20240115-001',
      customerName: 'TechCorp Inc.',
      industry: 'Software',
      companySize: 'large',
      currentChallenge: 'Digital transformation',
      budget: 500000,
      decisionTimeline: '2024-Q2',
      dealStatus: 'negotiation',
      proposalContent: 'Cloud migration service',
    };

    const result = await generateRecommendation(
      inputData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(callCount).toBe(3);
    expect(result.successScore).toBeGreaterThanOrEqual(50);
    expect(result.successScore).toBeLessThanOrEqual(75);
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.length).toBeLessThanOrEqual(200);
    expect(result.dataSource).toBe('PatternMaster');
    expect(typeof result.successScore).toBe('number');
    expect(typeof result.reasoning).toBe('string');
  });
});