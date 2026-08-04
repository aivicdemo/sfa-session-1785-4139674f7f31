import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  let aiRecommendationEngineStub: any;

  beforeEach(() => {
    aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('SCEN-2122: [error] 提案内容と標準プロセスの乖離度算出 - 提案実行日時が分析対象の商談開始日より前のとき、エラーが発生する', () => {
    const dealStartDateTime = new Date('2026-01-15T09:00:00Z');
    const proposalExecutionDateTime = new Date('2026-01-14T16:00:00Z');

    const proposalContent = {
      dealId: 'DEAL-001',
      dealStartDateTime: dealStartDateTime,
      proposalTitle: 'テスト提案',
      proposalExecutionDateTime: proposalExecutionDateTime,
      customerAttributes: {
        industry: '製造業',
        companySize: '中堅企業',
      },
      proposalApproach: '顧客の課題に基づいた提案',
    };

    const result = calculateProposalProcessDeviation(
      proposalContent,
      aiRecommendationEngineStub
    );

    expect(result).toEqual({
      errorCode: 'INVALID_PROPOSAL_DATETIME',
      errorMessage: '提案実行日時は商談開始日時以降である必要があります',
      statusCode: 400,
    });

    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});