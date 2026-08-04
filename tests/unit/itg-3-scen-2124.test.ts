import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2124
  test('提案内容と標準プロセスの乖離度算出 - 顧客対応記録の記録日時が無効な形式のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidCustomerInteractionRecord = {
      customerId: 'CUST-12345',
      recordedAt: '2024/13/45 25:70:90',
      proposalContent: 'Standard proposal for customer',
      interactionPattern: 'follow-up',
    };

    const standardProcessDefinition = {
      processId: 'PROC-001',
      stages: ['initial_contact', 'needs_analysis', 'proposal', 'negotiation'],
      expectedTimeline: 30,
    };

    expect(() =>
      calculateProposalProcessDeviation(
        invalidCustomerInteractionRecord,
        standardProcessDefinition,
        mockAIRecommendationEngine
      )
    ).toThrow(/記録日時の形式が無効です|Invalid datetime format/);
  });
});