import { generateExecutivePresentationMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2007
  test('リスク要因の優先度が無効な値（-1など）のとき、資料生成がエラーになる', () => {
    const invalidRiskPriority = -1;
    const executiveMaterialRequest = {
      customerName: 'テスト顧客A',
      proposalContent: '提案内容詳細',
      proposalAppropriateness: 85,
      investmentEffectiveness: 9500000,
      riskFactors: [
        {
          riskName: 'リスク要因1',
          priority: invalidRiskPriority,
          mitigationMeasure: '対策内容',
        },
      ],
      improvementProposals: ['改善提案1'],
    };

    expect(() => generateExecutivePresentationMaterial(executiveMaterialRequest)).toThrow(/リスク要因の優先度/);
  });
});