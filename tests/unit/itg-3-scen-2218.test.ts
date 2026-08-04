import { analyzeProposalPatternWithStandardProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2218
  test('提案内容が1件のとき標準プロセスと正常に比較される', () => {
    const proposalData = {
      proposalId: 'PROP-001',
      proposalType: '業務改善ツール導入',
      successCaseCount: 12,
      applicabilityScore: 0.85,
    };

    const standardProcessPattern = {
      patternId: 'STD-PAT-001',
      salesStages: ['要件定義', '提案', '交渉', '契約'],
      duration: 60,
      successRate: 0.68,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationContent: '顧客課題に適合した提案アプローチ',
        evidenceReasoning: '過去事例との類似度0.82',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = analyzeProposalPatternWithStandardProcess(
      proposalData,
      standardProcessPattern,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.proposalType).toBe('業務改善ツール導入');
    expect(result.alignedSalesStages).toEqual(['要件定義', '提案', '交渉', '契約']);
    expect(result.alignmentScore).toBe(0.85);
    expect(result.recommendationContent).toBe('顧客課題に適合した提案アプローチ');
    expect(result.reasoningExplanation).toContain('過去事例との類似度0.82');
    expect(result.reasoningExplanation).toContain('成功事例12件');
    expect(result.reasoningExplanation).toContain('標準成功率68%');
    expect(typeof result.alignmentScore).toBe('number');
    expect(result.alignmentScore).toBeGreaterThanOrEqual(0);
    expect(result.alignmentScore).toBeLessThanOrEqual(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith('PROP-001');
  });
});