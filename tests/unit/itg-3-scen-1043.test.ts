import { generateRecommendationWithHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1043
  test('同じ入力条件で推奨が2回実行された場合、同じ推奨結果が記録される', () => {
    // 推奨履歴テーブルの初期化
    const recommendationHistory: Array<{
      id: string;
      recommendationId: string;
      inputConditionHash: string;
      industryType: string;
      dealAmount: number;
      proposedProduct: string;
      proposalApproach: string;
      confidenceScore: number;
      reasoning: string;
      timestamp: string;
    }> = [];

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20250801-001',
        proposalApproach: '段階的導入',
        confidenceScore: 0.92,
        reasoning: '段階的な導入アプローチにより、組織への変化管理リスクを軽減しながら、システムの効果を段階的に実現できます。製造業の複雑なプロセスに対応するため、まずコア機能から導入し、その後、受注・請求などの周辺機能を段階的に拡張することを推奨します。'
      })
    };

    // 入力条件の定義
    const inputCondition = {
      industryType: '製造業',
      dealAmount: 5000000,
      proposedProduct: 'ERP導入'
    };

    // 1回目の推奨実行
    const firstExecutionResult = generateRecommendationWithHistory(
      inputCondition,
      mockAIEngine,
      recommendationHistory
    );

    // 1回目の実行結果が推奨履歴テーブルに記録されたことを確認
    expect(recommendationHistory).toHaveLength(1);
    const firstRecord = recommendationHistory[0];
    expect(firstRecord.recommendationId).toBe('REC-20250801-001');
    expect(firstRecord.industryType).toBe('製造業');
    expect(firstRecord.dealAmount).toBe(5000000);
    expect(firstRecord.proposedProduct).toBe('ERP導入');
    expect(firstRecord.proposalApproach).toBe('段階的導入');
    expect(firstRecord.confidenceScore).toBe(0.92);
    expect(firstRecord.reasoning).toBe(
      '段階的な導入アプローチにより、組織への変化管理リスクを軽減しながら、システムの効果を段階的に実現できます。製造業の複雑なプロセスに対応するため、まずコア機能から導入し、その後、受注・請求などの周辺機能を段階的に拡張することを推奨します。'
    );
    const firstInputConditionHash = firstRecord.inputConditionHash;
    expect(typeof firstInputConditionHash).toBe('string');
    expect(firstInputConditionHash.length).toBeGreaterThan(0);

    // 2回目の推奨実行（同一の入力条件）
    const secondExecutionResult = generateRecommendationWithHistory(
      inputCondition,
      mockAIEngine,
      recommendationHistory
    );

    // 2回目の実行結果が推奨履歴テーブルに新たに記録されたことを確認
    expect(recommendationHistory).toHaveLength(2);
    const secondRecord = recommendationHistory[1];
    expect(secondRecord.recommendationId).toBe('REC-20250801-001');
    expect(secondRecord.proposalApproach).toBe('段階的導入');
    expect(secondRecord.confidenceScore).toBe(0.92);

    // 1回目と2回目の推奨結果を比較
    expect(firstRecord.recommendationId).toBe(secondRecord.recommendationId);
    expect(firstRecord.proposalApproach).toBe(secondRecord.proposalApproach);
    expect(firstRecord.confidenceScore).toBe(secondRecord.confidenceScore);
    expect(firstRecord.reasoning).toBe(secondRecord.reasoning);

    // 1回目と2回目のレコードの入力条件ハッシュ値が同じであることを確認
    expect(firstRecord.inputConditionHash).toBe(secondRecord.inputConditionHash);

    // 推奨履歴テーブルに同じ入力条件に対して2つのレコードが存在すること、
    // かつそれらの推奨内容が完全に同一であることを最終確認
    const recordsWithSameHash = recommendationHistory.filter(
      r => r.inputConditionHash === firstInputConditionHash
    );
    expect(recordsWithSameHash).toHaveLength(2);
    expect(recordsWithSameHash[0].recommendationId).toBe(recordsWithSameHash[1].recommendationId);
    expect(recordsWithSameHash[0].proposalApproach).toBe(recordsWithSameHash[1].proposalApproach);
    expect(recordsWithSameHash[0].confidenceScore).toBe(recordsWithSameHash[1].confidenceScore);
    expect(recordsWithSameHash[0].reasoning).toBe(recordsWithSameHash[1].reasoning);
  });
});