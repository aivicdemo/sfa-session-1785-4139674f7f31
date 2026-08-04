import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2084: 提案内容と顧客対応パターンの標準プロセス照合分析 - 成功パターン合致スコアが76のとき高度な合致と判定', () => {
    fetchMock.resetMocks();

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 76,
        matchLevel: 'HIGH_MATCH',
        explanation: '顧客業種（製造業）と商談段階（要件定義）の組み合わせが過去の成功事例と76%の一致度で合致しており、提案内容（ERP導入支援）が適用可能なパターンとして認識されています。',
        applicableSuccessPatterns: [
          {
            patternId: 'PAT-001',
            description: '製造業向けERP導入プロジェクト',
            successRate: 0.82,
            sampleCount: 23
          }
        ]
      })
    };

    const proposalContent = {
      customerId: 'CUST-12345',
      customerIndustry: 'manufacturing',
      dealStage: 'requirement_definition',
      proposalType: 'erp_implementation_support',
      proposalDescription: 'エンタープライズリソースプランニング(ERP)システムの導入コンサルティング',
      estimatedBudget: 5000000,
      proposedTimeline: 12
    };

    const customerResponsePattern = {
      contactFrequency: 'weekly',
      responseTime: 48,
      engagementLevel: 'high',
      decisionMakerParticipation: true,
      requirementsClarityScore: 0.85
    };

    const standardProcessContext = {
      industryStandard: 'manufacturing_erp',
      dealStageStandard: 'requirement_definition',
      successThreshold: 0.70,
      evaluationDate: new Date('2024-01-15T11:00:00Z')
    };

    const result = evaluatePatternRelevance(
      proposalContent,
      customerResponsePattern,
      standardProcessContext,
      mockAIRecommendationEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        relevanceScore: 76,
        matchLevel: 'HIGH_MATCH',
        isHighMatch: true,
        explanation: expect.stringContaining('製造業'),
        applicableSuccessPatterns: expect.arrayContaining([
          expect.objectContaining({
            patternId: 'PAT-001',
            successRate: expect.any(Number)
          })
        ]),
        evaluationTimestamp: expect.any(String),
        recommendedNextAction: expect.stringContaining('提案')
      })
    );

    expect(result.matchLevel).toBe('HIGH_MATCH');
    expect(result.relevanceScore).toBe(76);
    expect(result.isHighMatch).toBe(true);
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThan(0);
    expect(result.applicableSuccessPatterns).toBeDefined();
    expect(Array.isArray(result.applicableSuccessPatterns)).toBe(true);
    expect(result.applicableSuccessPatterns.length).toBeGreaterThan(0);
  });
});