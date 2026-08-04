import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1225
  test('提案妥当性確認判定機能 - 確認者ユーザーIDがnullのときエラーを返す', () => {
    const proposalId = 'PROP-20240115-001';
    const proposalContent = {
      productName: 'クラウド営業支援ツール',
      estimatedPrice: 5000000,
      implementationPeriod: 6,
      expectedROI: 1.8,
    };
    const customerConstraints = {
      maxBudget: 10000000,
      maxImplementationPeriod: 12,
      minRequiredROI: 1.5,
    };
    const reviewerUserId = null;

    expect(() =>
      evaluateProposalValidity({
        proposalId,
        proposalContent,
        customerConstraints,
        reviewerUserId,
      })
    ).toThrow(/確認者ユーザーID|reviewer.*user.*id/i);
  });
});