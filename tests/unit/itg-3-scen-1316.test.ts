import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案内容と顧客制約条件の自動照合機能', () => {
  // SCEN-1316
  test('顧客制約条件データが複数件のとき、すべての制約に対して照合が実行される', () => {
    // 準備: 顧客制約条件を3件準備
    const customerConstraints = [
      {
        constraint_id: 'CONSTRAINT_A',
        constraint_name: '予算上限',
        constraint_type: 'BUDGET',
        constraint_value: 5000000,
        constraint_unit: 'JPY',
      },
      {
        constraint_id: 'CONSTRAINT_B',
        constraint_name: '導入期間',
        constraint_type: 'IMPLEMENTATION_PERIOD',
        constraint_value: 3,
        constraint_unit: 'MONTH',
      },
      {
        constraint_id: 'CONSTRAINT_C',
        constraint_name: '既存システム連携',
        constraint_type: 'SYSTEM_INTEGRATION',
        constraint_value: 1,
        constraint_unit: 'REQUIRED',
      },
    ];

    // 提案内容を準備
    const proposalContent = {
      proposal_id: 'PROPOSAL_001',
      customer_id: 'CUSTOMER_001',
      total_budget: 6000000,
      implementation_period: 4,
      requires_system_integration: true,
      proposed_approach: 'Custom implementation with existing system integration',
    };

    // AIRecommendationEngineのスタブを準備
    const callTracker: Array<{
      constraintId: string;
      callOrder: number;
    }> = [];
    let callCount = 0;

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((constraintId: string) => {
        callCount++;
        callTracker.push({
          constraintId,
          callOrder: callCount,
        });

        if (constraintId === 'CONSTRAINT_A') {
          return { is_relevant: false, relevance_score: 0, reason: '予算超過' };
        } else if (constraintId === 'CONSTRAINT_B') {
          return { is_relevant: false, relevance_score: 0, reason: '導入期間超過' };
        } else if (constraintId === 'CONSTRAINT_C') {
          return { is_relevant: true, relevance_score: 100, reason: '要件満たす' };
        }
        return { is_relevant: false, relevance_score: 0, reason: '未定義' };
      }),
    };

    // 照合機能を実行
    const evaluationResults = evaluatePatternRelevance(
      proposalContent,
      customerConstraints,
      mockAIEngine as any,
    );

    // 検証: evaluatePatternRelevanceメソッドが3件すべての制約に対して呼び出されたか確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      'CONSTRAINT_A',
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      'CONSTRAINT_B',
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      'CONSTRAINT_C',
    );

    // 検証: 各制約条件の照合結果が個別に記録されているか確認
    expect(evaluationResults).toHaveLength(3);
    expect(evaluationResults[0]).toEqual({
      constraint_id: 'CONSTRAINT_A',
      constraint_name: '予算上限',
      is_matching: false,
      evaluation_reason: '予算超過',
      evaluation_score: 0,
    });
    expect(evaluationResults[1]).toEqual({
      constraint_id: 'CONSTRAINT_B',
      constraint_name: '導入期間',
      is_matching: false,
      evaluation_reason: '導入期間超過',
      evaluation_score: 0,
    });
    expect(evaluationResults[2]).toEqual({
      constraint_id: 'CONSTRAINT_C',
      constraint_name: '既存システム連携',
      is_matching: true,
      evaluation_reason: '要件満たす',
      evaluation_score: 100,
    });

    // 検証: すべての制約条件が処理されたことを確認
    expect(callTracker).toHaveLength(3);
    expect(callTracker.map((ct) => ct.constraintId)).toEqual([
      'CONSTRAINT_A',
      'CONSTRAINT_B',
      'CONSTRAINT_C',
    ]);
  });
});