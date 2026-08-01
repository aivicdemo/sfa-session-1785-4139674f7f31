import { extractSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-716
  test('成功・失敗要因の抽出と承認基準判定機能 - 営業部長の承認基準が未設定のとき、デフォルト承認基準が適用される', () => {
    const input = {
      userId: 'user_sales_director_001',
      userRole: 'sales_director',
      dealDataList: [
        {
          dealId: 'deal_001',
          customerId: 'cust_001',
          dealAmount: 5000000,
          contractedAmount: 3500000,
          proposalApprovalCount: 2,
          proposalTotalCount: 4,
          customerSatisfactionScore: 4.2,
          successFactors: ['早期提案', '継続的フォローアップ'],
          failureFactors: ['初期接触遅延'],
        },
        {
          dealId: 'deal_002',
          customerId: 'cust_002',
          dealAmount: 2000000,
          contractedAmount: 1500000,
          proposalApprovalCount: 1,
          proposalTotalCount: 2,
          customerSatisfactionScore: 3.8,
          successFactors: ['顧客ニーズの深堀り'],
          failureFactors: [],
        },
      ],
      targetMetrics: {
        revenueTargetAchievementRate: 0.7,
        customerSatisfactionScoreThreshold: 3.5,
        proposalApprovalRateThreshold: 0.5,
      },
      customCriteriaConfig: null,
    };

    const result = extractSuccessFailureFactors(input);

    expect(result.appliedCriteriaType).toBe('default');
    expect(result.appliedCriteria).toEqual({
      revenueTargetAchievementRate: 0.7,
      customerSatisfactionScoreThreshold: 3.5,
      proposalApprovalRateThreshold: 0.5,
    });
    expect(result.criteriaDisplayText).toBe('デフォルト（営業部長）');
    expect(result.judgmentResults).toHaveLength(2);
    expect(result.judgmentResults[0]).toEqual({
      dealId: 'deal_001',
      revenueAchievementRate: 0.7,
      meetsRevenueTarget: true,
      customerSatisfactionScore: 4.2,
      meetsCustomerSatisfactionTarget: true,
      proposalApprovalRate: 0.5,
      meetsProposalApprovalTarget: true,
      extractedSuccessFactors: ['早期提案', '継続的フォローアップ'],
      extractedFailureFactors: ['初期接触遅延'],
      overallJudgment: true,
    });
    expect(result.judgmentResults[1]).toEqual({
      dealId: 'deal_002',
      revenueAchievementRate: 0.75,
      meetsRevenueTarget: true,
      customerSatisfactionScore: 3.8,
      meetsCustomerSatisfactionTarget: true,
      proposalApprovalRate: 0.5,
      meetsProposalApprovalTarget: true,
      extractedSuccessFactors: ['顧客ニーズの深堀り'],
      extractedFailureFactors: [],
      overallJudgment: true,
    });
  });
});