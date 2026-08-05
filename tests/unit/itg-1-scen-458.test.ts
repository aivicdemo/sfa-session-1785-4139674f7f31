import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-458: 営業案件が複数ステージを経過した場合、各ステップの完了状況が正常に集計される', () => {
    // テストデータ: 営業案件のステージ遷移
    const salesOpportunityId = 'opp-001';
    const salesPersonId = 'sp-001';
    const customerId = 'cust-001';

    const stageTransitionData = [
      {
        opportunityId: salesOpportunityId,
        salesPersonId: salesPersonId,
        customerId: customerId,
        stageName: '初期接触',
        completedAt: new Date('2024-01-10T09:00:00Z'),
      },
      {
        opportunityId: salesOpportunityId,
        salesPersonId: salesPersonId,
        customerId: customerId,
        stageName: '提案資料送付',
        completedAt: new Date('2024-01-15T14:30:00Z'),
      },
      {
        opportunityId: salesOpportunityId,
        salesPersonId: salesPersonId,
        customerId: customerId,
        stageName: '顧客検討中',
        completedAt: new Date('2024-01-22T10:00:00Z'),
      },
      {
        opportunityId: salesOpportunityId,
        salesPersonId: salesPersonId,
        customerId: customerId,
        stageName: '契約締結',
        completedAt: new Date('2024-02-01T16:45:00Z'),
      },
    ];

    // 行動パターン分析レポート生成機能を呼び出し
    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId: salesPersonId,
      stageTransitionRecords: stageTransitionData,
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-02-28T23:59:59Z'),
    });

    // 期待値の計算
    // 初期接触→提案資料送付: 2024-01-10 → 2024-01-15 = 5日
    const daysInitialContactToProposal = 5;
    // 提案資料送付→顧客検討中: 2024-01-15 → 2024-01-22 = 7日
    const daysProposalToReview = 7;
    // 顧客検討中→契約締結: 2024-01-22 → 2024-02-01 = 10日
    const daysReviewToContract = 10;

    // レポート内容の検証
    expect(report).toBeDefined();
    expect(report.salesPersonId).toBe(salesPersonId);
    expect(report.opportunityPatterns).toHaveLength(1);

    const opportunityPattern = report.opportunityPatterns[0];
    expect(opportunityPattern.opportunityId).toBe(salesOpportunityId);
    expect(opportunityPattern.customerId).toBe(customerId);

    // ステージ別完了状況の検証
    const stageCompletion = opportunityPattern.stageCompletion;
    expect(stageCompletion['初期接触'].completedCount).toBe(1);
    expect(stageCompletion['提案資料送付'].completedCount).toBe(1);
    expect(stageCompletion['顧客検討中'].completedCount).toBe(1);
    expect(stageCompletion['契約締結'].completedCount).toBe(1);

    // ステージ間所要期間の検証
    const stageDurations = opportunityPattern.stageDurations;
    expect(stageDurations['初期接触→提案資料送付']).toBe(daysInitialContactToProposal);
    expect(stageDurations['提案資料送付→顧客検討中']).toBe(daysProposalToReview);
    expect(stageDurations['顧客検討中→契約締結']).toBe(daysReviewToContract);

    // 全体ステージ完了フロー検証
    expect(opportunityPattern.completionSequence).toEqual([
      '初期接触',
      '提案資料送付',
      '顧客検討中',
      '契約締結',
    ]);
  });
});