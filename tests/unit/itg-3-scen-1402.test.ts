import { calculateROIWithRounding } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1402
  test('提案内容と顧客制約条件の自動照合機能 - 投資対効果の計算結果が端数となるとき、指定の丸め方で処理される', () => {
    const proposalData = {
      implementationCost: 3000000,
      annualSavingsEffect: 1000000,
    };

    const customerConstraint = {
      budgetLimit: 10000000,
      roiTarget: 25.5,
    };

    const roundingRuleHALF_UP = 'HALF_UP';
    const roundingRuleCEILING = 'CEILING';

    const resultWithHALF_UP = calculateROIWithRounding(
      proposalData.annualSavingsEffect,
      proposalData.implementationCost,
      roundingRuleHALF_UP
    );

    const resultWithCEILING = calculateROIWithRounding(
      proposalData.annualSavingsEffect,
      proposalData.implementationCost,
      roundingRuleCEILING
    );

    expect(resultWithHALF_UP).toBe(-66.67);
    expect(resultWithCEILING).toBe(-66.66);
  });
});