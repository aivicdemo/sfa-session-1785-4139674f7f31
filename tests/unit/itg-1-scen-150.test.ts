import { generateBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-150
  test('乖離度が100%を超えるとき、エラーが発生する', () => {
    const salesRepId = 'SR001';
    const analysisInput = {
      salesRepId,
      standardProcessSteps: ['initial_contact', 'proposal', 'negotiation', 'closing'],
      actualBehaviorData: {
        initialContactFrequency: 2,
        proposalSuccessRate: 0.5,
        negotiationDuration: 15,
        closingRate: 0.3,
      },
      contractResults: [
        { dealId: 'DEAL001', contractAmount: 100000, achieved: true },
        { dealId: 'DEAL002', contractAmount: 200000, achieved: false },
      ],
      deviationDegree: 101,
    };

    expect(() => generateBehaviorAnalysisReport(analysisInput)).toThrow(/乖離度/);
  });
});