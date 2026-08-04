import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2424
  test('[edge] 推奨精度スコア算出機能 - マッチした成功パターンが複数件のときスコアが統合計算される', () => {
    const matchedPatterns = [
      {
        patternId: 'pattern_A',
        patternName: 'パターンA',
        relevanceScore: 0.85,
        dealCondition: {
          customerIndustry: 'IT',
          dealStage: 'proposal',
          dealValue: 5000000
        }
      },
      {
        patternId: 'pattern_B',
        patternName: 'パターンB',
        relevanceScore: 0.72,
        dealCondition: {
          customerIndustry: 'IT',
          dealStage: 'negotiation',
          dealValue: 3000000
        }
      },
      {
        patternId: 'pattern_C',
        patternName: 'パターンC',
        relevanceScore: 0.68,
        dealCondition: {
          customerIndustry: 'Manufacturing',
          dealStage: 'proposal',
          dealValue: 2000000
        }
      }
    ];

    const currentDealCondition = {
      customerIndustry: 'IT',
      dealStage: 'proposal',
      dealValue: 4500000,
      customerSize: 'large',
      customerProblem: 'digital_transformation'
    };

    const result = evaluatePatternRelevance(matchedPatterns, currentDealCondition);

    expect(result.integratedScore).toBe(0.75);
    expect(result.patternCount).toBe(3);
    expect(result.isValid).toBe(true);
  });
});