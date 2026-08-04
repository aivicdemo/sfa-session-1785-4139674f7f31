import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1414
  test('同じ照合入力で2回実行したとき、同じ照合結果が返却される', () => {
    // 顧客制約条件オブジェクトの作成
    const customerConstraints = {
      industry: '製造',
      budgetLimit: 5000000,
      implementationDeadline: '2026-03-31',
      industryId: 'IND001',
      customerId: 'CUST001'
    };

    // 提案内容オブジェクトの作成
    const proposalContent = {
      productCategory: '業務効率化ツール',
      estimatedCost: 3500000,
      implementationPeriod: 90,
      expectedROI: 1.8,
      targetIndustries: ['製造', '流通'],
      proposalId: 'PROP001'
    };

    // 第1回目の照合実行
    const firstResult = evaluateProposalConstraintAlignment(
      proposalContent,
      customerConstraints
    );

    // 第1回目の結果を保存
    const firstAlignmentScore = firstResult.alignmentScore;
    const firstMatchingJudgment = firstResult.isMatching;
    const firstReasoningList = JSON.parse(JSON.stringify(firstResult.reasoningList));
    const firstApplicabilityScore = firstResult.applicabilityScore;

    // 第2回目の照合実行（同じ入力で実行）
    const secondResult = evaluateProposalConstraintAlignment(
      proposalContent,
      customerConstraints
    );

    // 第2回目の結果を取得
    const secondAlignmentScore = secondResult.alignmentScore;
    const secondMatchingJudgment = secondResult.isMatching;
    const secondReasoningList = secondResult.reasoningList;
    const secondApplicabilityScore = secondResult.applicabilityScore;

    // 照合スコアの完全一致を検証（浮動小数点数の完全一致）
    expect(firstAlignmentScore).toBe(secondAlignmentScore);

    // マッチング判定の一致を検証
    expect(firstMatchingJudgment).toBe(secondMatchingJudgment);

    // 根拠リストの一致を検証（同一の根拠項目が同一の順序で存在）
    expect(firstReasoningList.length).toBe(secondReasoningList.length);
    firstReasoningList.forEach((reason, index) => {
      expect(reason.factor).toBe(secondReasoningList[index].factor);
      expect(reason.evaluation).toBe(secondReasoningList[index].evaluation);
      expect(reason.score).toBe(secondReasoningList[index].score);
    });

    // 提案適用可能度評価の完全一致を検証
    expect(firstApplicabilityScore).toBe(secondApplicabilityScore);

    // マッチング判定が真であることを確認
    expect(firstMatchingJudgment).toBe(true);

    // 照合スコアが有効な範囲内（0～100）であることを確認
    expect(firstAlignmentScore).toBeGreaterThanOrEqual(0);
    expect(firstAlignmentScore).toBeLessThanOrEqual(100);

    // 適用可能度スコアが有効な範囲内（0～100）であることを確認
    expect(firstApplicabilityScore).toBeGreaterThanOrEqual(0);
    expect(firstApplicabilityScore).toBeLessThanOrEqual(100);

    // 根拠リストが空でないことを確認
    expect(firstReasoningList.length).toBeGreaterThan(0);
  });
});