import { evaluateProposalAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2197
  test('提案ステップが標準プロセスのステップを1つ欠落させているとき、欠落による乖離が個別に算出される', () => {
    // Arrange: 標準プロセスを定義
    const standardProcessSteps = [
      { id: 'step_a', name: 'ステップA', order: 1 },
      { id: 'step_b', name: 'ステップB', order: 2 },
      { id: 'step_c', name: 'ステップC', order: 3 },
      { id: 'step_d', name: 'ステップD', order: 4 },
    ];

    // Arrange: 提案ステップ配列を定義（ステップBを欠落させる）
    const proposalSteps = [
      { id: 'step_a', name: 'ステップA', order: 1 },
      { id: 'step_c', name: 'ステップC', order: 3 },
      { id: 'step_d', name: 'ステップD', order: 4 },
    ];

    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        steps: proposalSteps,
        recommendationId: 'rec_001',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 提案内容と標準プロセスの照合処理を実行
    const result = evaluateProposalAlignment(
      proposalSteps,
      standardProcessSteps,
      mockAIEngine
    );

    // Assert: 照合結果から乖離分析情報を抽出・検証
    expect(result.discrepancies).toBeDefined();
    expect(Array.isArray(result.discrepancies)).toBe(true);

    // Assert: 乖離分析の配列要素数は1件
    expect(result.discrepancies).toHaveLength(1);

    // Assert: 乖離分析の最初の要素が欠落ステップの情報を保有しているか確認
    const firstDiscrepancy = result.discrepancies[0];
    expect(firstDiscrepancy).toBeDefined();

    // Assert: type属性値を確認
    expect(firstDiscrepancy.type).toBe('missing_step');

    // Assert: missingStep属性値を確認
    expect(firstDiscrepancy.missingStep).toBe('ステップB');

    // Assert: impactScore属性が0～1の範囲内の数値として個別に算出されている
    expect(typeof firstDiscrepancy.impactScore).toBe('number');
    expect(firstDiscrepancy.impactScore).toBeGreaterThanOrEqual(0);
    expect(firstDiscrepancy.impactScore).toBeLessThanOrEqual(1);
    expect(firstDiscrepancy.impactScore).toBe(0.25);
  });
});