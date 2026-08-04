import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2215: [edge] 顧客対応パターンの分析データが欠けている場合の処理
  test('顧客対応パターンが null のとき、マッチスコアは計算されず、空の結果が返される', () => {
    const payload = {
      dealConditions: {
        customerId: 'cust-001',
        dealAmount: 5000000,
        dealStage: 'proposal',
      },
      customerInteractionPatterns: null,
      successPatternTemplate: {
        patternId: 'pat-001',
        customerSegment: 'enterprise',
        dealStageSequence: ['discovery', 'proposal', 'negotiation', 'closing'],
        successFactors: ['timely_follow_up', 'clear_value_prop', 'executive_alignment'],
        failureFactors: ['delayed_response', 'poor_alignment', 'budget_mismatch'],
      },
    };

    const result = evaluatePatternRelevance(payload);

    expect(result).toEqual({
      matchScores: [],
      isApplicable: false,
      skippedReason: '顧客対応パターンが null のため、マッチスコア計算をスキップしました',
    });
    expect(result.matchScores).toHaveLength(0);
    expect(result.isApplicable).toBe(false);
  });
});