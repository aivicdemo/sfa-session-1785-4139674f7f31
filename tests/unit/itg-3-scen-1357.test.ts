import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 顧客制約条件の照合', () => {
  // SCEN-1357
  test('顧客のスケジュール制約が登録されていないとき照合処理がエラーになる', () => {
    const customerId = 'CUST-20250101';
    const customerName = 'テスト顧客A';
    const proposalContent = {
      proposalId: 'PROP-001',
      description: 'クラウド導入提案',
      estimatedImplementationStart: '2025-03-01',
      estimatedImplementationEnd: '2025-06-30',
      proposedBudget: 5000000,
    };

    const customerConstraints = {
      customerId,
      scheduleConstraint: null,
      budgetConstraint: 10000000,
      purchaseFrequency: 'annual',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0,
        isApplicable: false,
      }),
    };

    const systemLog: string[] = [];
    const originalConsoleError = console.error;
    console.error = jest.fn((msg: string) => {
      systemLog.push(msg);
    });

    try {
      const result = evaluateProposalConstraintAlignment(
        proposalContent,
        customerConstraints,
        mockAIEngine
      );

      expect(result).toEqual({
        errorCode: 'CONSTRAINT_VALIDATION_ERROR',
        isAligned: false,
        alignmentScore: null,
        userMessage: '顧客のスケジュール情報が未設定です。顧客マスタでスケジュール制約条件を登録してから照合を実行してください',
        systemMessage: `顧客ID: ${customerId}のスケジュール制約条件が登録されていません`,
      });

      expect(systemLog).toContain(
        `顧客ID: ${customerId}のスケジュール制約条件が登録されていません`
      );

      expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    } finally {
      console.error = originalConsoleError;
    }
  });
});