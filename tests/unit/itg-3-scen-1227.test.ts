import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1227
  test('提案妥当性確認判定機能 - 提案適合スコアが負数のとき、エラーを返す', () => {
    const invalidProposalData = {
      proposalId: 'PROP-001',
      customerId: 'CUST-123',
      proposalContent: '提案内容の詳細',
      proposalRelevanceScore: -0.5,
      customerConstraints: {
        budgetLimit: 1000000,
        implementationSchedule: '2024-06-30',
        productCategory: 'software'
      },
      successPatternData: {
        patternId: 'PAT-001',
        matchDegree: 0.85,
        historicalExamples: ['DEAL-001', 'DEAL-002']
      }
    };

    expect(() => evaluateProposalValidity(invalidProposalData)).toThrow(/提案適合スコア/);
  });
});