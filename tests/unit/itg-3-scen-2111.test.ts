import { analyzeProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2111
  test('提案内容と標準プロセスの乖離度算出 - 分析対象の商談IDが空文字列のとき、エラーが発生する', () => {
    const emptyDealId = '';
    const proposalContent = {
      proposalTitle: 'クラウド導入提案',
      proposalDescription: 'システム刷新による業務効率化',
      proposedApproach: '段階導入アプローチ',
      estimatedCost: 5000000,
      implementationPeriod: 6,
    };
    const standardProcess = {
      processStepName: '提案フェーズ',
      expectedDuration: 2,
      requiredApproaches: ['ニーズ分析', '提案書作成', 'プレゼンテーション'],
    };
    const aiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      analyzeProposalDeviation(
        emptyDealId,
        proposalContent,
        standardProcess,
        aiRecommendationEngine,
      ),
    ).toThrow(/商談ID/);
  });
});