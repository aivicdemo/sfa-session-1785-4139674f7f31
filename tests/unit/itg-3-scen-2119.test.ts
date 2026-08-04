import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2119: 提案内容と標準プロセスの乖離度算出 - 分析実行日時が無効な形式のとき、エラーが発生する', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidAnalysisDateTime = '2026-13-45T99:99:99Z';

    const proposalContent = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalApproach: 'custom-approach-001',
      proposalText: 'Sample proposal content',
    };

    const standardProcessReference = {
      processId: 'PROC-STANDARD-001',
      processSteps: [
        {
          stepName: 'initial-contact',
          expectedBehavior: 'contact-customer',
        },
        {
          stepName: 'needs-analysis',
          expectedBehavior: 'analyze-requirements',
        },
      ],
    };

    expect(() => {
      calculateProposalProcessDeviation(
        proposalContent,
        standardProcessReference,
        invalidAnalysisDateTime,
        aiRecommendationEngineStub
      );
    }).toThrow(/INVALID_DATETIME_FORMAT/);
  });
});