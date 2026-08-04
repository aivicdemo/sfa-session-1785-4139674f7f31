import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性判定', () => {
  // SCEN-1200
  test('同じ提案内容で2回判定しても同じ承認可否が返される', () => {
    // テスト用の提案内容を準備
    const proposalInput = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'mid-size',
      dealCondition: 'expansion_project',
      proposedBudget: 50000,
      proposalApproach: 'integrated_solution',
      proposalContent: 'ERP導入による業務効率化',
      dealAmount: 48000,
      timeline: 180,
    };

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: 'phased_implementation',
        confidenceScore: 85,
        reasoningExplanation: '製造業の中規模企業による拡大案件で、ERP導入は成功事例が豊富。段階的実装により導入リスク軽減可能。',
        reasoningData: {
          similarCases: 12,
          successRate: 0.89,
          averageImplementationTime: 160,
        },
      }),
    };

    // 1回目の判定実行
    const firstResult = evaluateProposalValidity(proposalInput, mockAIEngine);

    // 1回目の判定結果を記録
    const firstApprovalFlag = firstResult.isApproved;
    const firstScore = firstResult.validityScore;
    const firstTimestamp = firstResult.evaluatedAt;

    // AIRecommendationEngineのスタブを同じ戻り値に設定した状態に保つ
    // （mockAIEngine は既に同じ戻り値を返すように設定済み）

    // 2回目の判定実行（同じ提案内容）
    const secondResult = evaluateProposalValidity(proposalInput, mockAIEngine);

    // 2回目の判定結果を記録
    const secondApprovalFlag = secondResult.isApproved;
    const secondScore = secondResult.validityScore;
    const secondTimestamp = secondResult.evaluatedAt;

    // 1回目と2回目の判定結果の承認可否フラグが同じ値であることを検証
    expect(firstApprovalFlag).toBe(secondApprovalFlag);
    // 両方とも承認（true）または却下（false）のいずれかであることを検証
    expect(typeof firstApprovalFlag).toBe('boolean');
    expect(typeof secondApprovalFlag).toBe('boolean');
    // スコアも同一の根拠データに基づくため、同じ値になることを検証
    expect(firstScore).toBe(secondScore);
    // 判定タイムスタンプは異なる可能性があるため、存在と型のみ検証
    expect(typeof firstTimestamp).toBe('string');
    expect(typeof secondTimestamp).toBe('string');
  });
});