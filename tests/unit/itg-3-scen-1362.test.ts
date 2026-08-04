import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1362
  test('営業担当者が依頼を提出していない状態で照合を実行しようとするとエラーになる', () => {
    const proposalEvaluationRequest = {
      requestId: undefined,
      proposalContent: {
        productName: '営業効率化ツール',
        proposedPrice: 5000000,
        implementationPeriod: 3,
      },
      customerConstraints: {
        budgetLimit: 10000000,
        maxImplementationMonths: 6,
        requiredFeatures: ['レポート生成', 'ユーザー管理'],
      },
    };

    expect(() =>
      evaluateProposalAgainstConstraints(proposalEvaluationRequest)
    ).toThrow(/依頼/);
  });
});