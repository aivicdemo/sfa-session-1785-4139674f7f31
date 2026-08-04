import { analyzeProposalAndCustomerPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2302: [edge] 提案内容と顧客対応パターンの標準プロセス比較機能 - 顧客対応パターンデータが欠落しているとき比較処理が中断される
  test('顧客対応パターンデータが欠落している場合、比較処理は中断され、エラーコードPATTERN_DATA_MISSINGを返す', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const proposalInput = {
      customerId: 'CUST-001',
      customerName: '株式会社ABC',
      industry: '製造業',
      companySize: '中規模',
      dealCondition: {
        dealId: 'DEAL-12345',
        productCategory: 'クラウドERP',
        proposedAmount: 5000000,
        timeline: '2026-Q2',
      },
      proposalApproach: {
        approachId: 'APPROACH-001',
        strategy: '段階的導入',
        keyMessages: ['運用負荷軽減', 'コスト効率化'],
        targetDecisionMaker: '経営層',
      },
    };

    const result = analyzeProposalAndCustomerPattern(
      proposalInput,
      aiRecommendationEngineStub
    );

    expect(result.errorCode).toBe('PATTERN_DATA_MISSING');
    expect(result.userMessage).toBe(
      '比較に必要な顧客対応パターンデータが見つかりません。AIRecommendationEngineから類似パターンを取得できなかったため、比較処理を中断しました'
    );
    expect(result.comparisonResult).toBeNull();
    expect(result.processInterrupted).toBe(true);
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});