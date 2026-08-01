import { calculateTrainingDataCompletionRate } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-736
  test('成功パターン適用ガイドラインの周知完了判定機能 - 同じ入力データで2回実行してもチーム全体の周知完了判定結果が同じになる', () => {
    const testData = {
      successCases: [
        {
          dealId: 'deal_001',
          customerId: 'cust_001',
          salesPersonId: 'sp_001',
          productCategory: 'enterprise_software',
          dealAmount: 5000000,
          contractedDate: '2024-01-15',
          successFactor: 'customer_pain_point_match',
        },
        {
          dealId: 'deal_002',
          customerId: 'cust_002',
          salesPersonId: 'sp_002',
          productCategory: 'cloud_service',
          dealAmount: 3000000,
          contractedDate: '2024-02-10',
          successFactor: 'timely_followup',
        },
        {
          dealId: 'deal_003',
          customerId: 'cust_003',
          salesPersonId: 'sp_001',
          productCategory: 'enterprise_software',
          dealAmount: 7000000,
          contractedDate: '2024-02-20',
          successFactor: 'proposal_alignment',
        },
        {
          dealId: 'deal_004',
          customerId: 'cust_004',
          salesPersonId: 'sp_003',
          productCategory: 'consulting',
          dealAmount: 2500000,
          contractedDate: '2024-03-05',
          successFactor: 'customer_pain_point_match',
        },
        {
          dealId: 'deal_005',
          customerId: 'cust_005',
          salesPersonId: 'sp_002',
          productCategory: 'cloud_service',
          dealAmount: 4200000,
          contractedDate: '2024-03-18',
          successFactor: 'timely_followup',
        },
      ],
      failureCases: [
        {
          dealId: 'deal_006',
          customerId: 'cust_006',
          salesPersonId: 'sp_001',
          productCategory: 'enterprise_software',
          dealAmount: 6000000,
          proposalDate: '2024-01-25',
          failureReason: 'no_followup',
        },
        {
          dealId: 'deal_007',
          customerId: 'cust_007',
          salesPersonId: 'sp_004',
          productCategory: 'cloud_service',
          dealAmount: 2800000,
          proposalDate: '2024-02-28',
          failureReason: 'misaligned_solution',
        },
        {
          dealId: 'deal_008',
          customerId: 'cust_008',
          salesPersonId: 'sp_003',
          productCategory: 'consulting',
          dealAmount: 1500000,
          proposalDate: '2024-03-12',
          failureReason: 'budget_constraint',
        },
      ],
    };

    const analysisParameters = {
      analysisPeriodDays: 90,
      targetTeam: 'sales_team_a',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    };

    const result1 = calculateTrainingDataCompletionRate(
      testData,
      analysisParameters,
    );

    const result2 = calculateTrainingDataCompletionRate(
      testData,
      analysisParameters,
    );

    expect(result1.completionFlag).toBe(result2.completionFlag);
    expect(result1.totalMemberCount).toBe(result2.totalMemberCount);
    expect(result1.completedMemberCount).toBe(result2.completedMemberCount);

    expect(result1.completionFlag).toBe(true);
    expect(result1.totalMemberCount).toBe(4);
    expect(result1.completedMemberCount).toBe(4);
  });
});