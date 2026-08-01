import { describe, test, expect, beforeEach } from '@jest/globals';
import { judgeProposalApproachBySuccessPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let successPatternMatrix: Array<{
    patternId: string;
    customerAttributeId: string;
    productCategoryId: string;
    proposalContentId: string;
    predictedPurchaseAmount: number;
    successRate: number;
    executionCount: number;
  }>;

  let proposalApproachRules: Array<{
    ruleId: string;
    minAmountThreshold: number;
    maxAmountThreshold: number;
  }>;

  beforeEach(() => {
    successPatternMatrix = [
      {
        patternId: 'pat_001',
        customerAttributeId: 'cust_attr_001',
        productCategoryId: 'prod_cat_001',
        proposalContentId: 'prop_content_001',
        predictedPurchaseAmount: 0,
        successRate: 0.75,
        executionCount: 12,
      },
    ];

    proposalApproachRules = [
      {
        ruleId: 'rule_001',
        minAmountThreshold: 1000000,
        maxAmountThreshold: 10000000,
      },
    ];
  });

  test('SCEN-263: 成功パターンマトリクス参照 - 購買予想金額が0の場合、金額条件による除外判定が実行されない', () => {
    const result = judgeProposalApproachBySuccessPattern({
      successPatternMatrix,
      proposalApproachRules,
      targetCustomerAttributeId: 'cust_attr_001',
      targetProductCategoryId: 'prod_cat_001',
    });

    expect(result).toEqual({
      candidatePatterns: [
        {
          patternId: 'pat_001',
          customerAttributeId: 'cust_attr_001',
          productCategoryId: 'prod_cat_001',
          proposalContentId: 'prop_content_001',
          predictedPurchaseAmount: 0,
          successRate: 0.75,
          executionCount: 12,
          isExcludedByAmountFilter: false,
          executionRecommendation: {
            proposedApproach: 'execute_proposal',
            priority: 'high',
            reasonForInclusion:
              'predicted_purchase_amount_zero_bypass_amount_threshold_filter',
          },
        },
      ],
      filterApplied: {
        amountThresholdMin: 1000000,
        amountThresholdMax: 10000000,
        amountFilterBypassForZeroAmount: true,
      },
    });
  });
});