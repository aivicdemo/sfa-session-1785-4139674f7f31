import { describe, test, expect } from '@jest/globals';
import { analyzeProcessDeviationCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  // SCEN-862
  test('同一の入力値で相関分析を2回実行した場合、同一の結果が返される', () => {
    const analysisInput = {
      periodStart: '2024-01-01',
      periodEnd: '2024-03-31',
      targetProcessStep: 'proposal_to_contract_days',
      correlationTarget: 'deal_completion',
      salesRepIds: ['rep_001', 'rep_002', 'rep_003', 'rep_004', 'rep_005'],
    };

    const deviationDataset = [
      {
        salesRepId: 'rep_001',
        dealId: 'deal_001',
        deviationScore: 0.15,
        daysFromProposalToContract: 12,
        dealCompleted: true,
        dealAmount: 500000,
      },
      {
        salesRepId: 'rep_001',
        dealId: 'deal_002',
        deviationScore: 0.08,
        daysFromProposalToContract: 8,
        dealCompleted: true,
        dealAmount: 750000,
      },
      {
        salesRepId: 'rep_002',
        dealId: 'deal_003',
        deviationScore: 0.22,
        daysFromProposalToContract: 18,
        dealCompleted: false,
        dealAmount: 0,
      },
      {
        salesRepId: 'rep_002',
        dealId: 'deal_004',
        deviationScore: 0.31,
        daysFromProposalToContract: 25,
        dealCompleted: false,
        dealAmount: 0,
      },
      {
        salesRepId: 'rep_003',
        dealId: 'deal_005',
        deviationScore: 0.05,
        daysFromProposalToContract: 5,
        dealCompleted: true,
        dealAmount: 1200000,
      },
      {
        salesRepId: 'rep_003',
        dealId: 'deal_006',
        deviationScore: 0.12,
        daysFromProposalToContract: 10,
        dealCompleted: true,
        dealAmount: 850000,
      },
      {
        salesRepId: 'rep_004',
        dealId: 'deal_007',
        deviationScore: 0.28,
        daysFromProposalToContract: 22,
        dealCompleted: false,
        dealAmount: 0,
      },
      {
        salesRepId: 'rep_004',
        dealId: 'deal_008',
        deviationScore: 0.19,
        daysFromProposalToContract: 15,
        dealCompleted: true,
        dealAmount: 600000,
      },
      {
        salesRepId: 'rep_005',
        dealId: 'deal_009',
        deviationScore: 0.10,
        daysFromProposalToContract: 7,
        dealCompleted: true,
        dealAmount: 920000,
      },
      {
        salesRepId: 'rep_005',
        dealId: 'deal_010',
        deviationScore: 0.06,
        daysFromProposalToContract: 6,
        dealCompleted: true,
        dealAmount: 1100000,
      },
    ];

    const resultSet1 = analyzeProcessDeviationCorrelation(analysisInput, deviationDataset);
    const resultSet2 = analyzeProcessDeviationCorrelation(analysisInput, deviationDataset);

    expect(resultSet1.correlationCoefficient).toBe(resultSet2.correlationCoefficient);
    expect(Math.abs(resultSet1.correlationCoefficient - resultSet2.correlationCoefficient)).toBeLessThan(0.00001);

    expect(resultSet1.detectedDeviationPatterns).toEqual(resultSet2.detectedDeviationPatterns);
    expect(resultSet1.detectedDeviationPatterns.length).toBe(resultSet2.detectedDeviationPatterns.length);

    for (let i = 0; i < resultSet1.detectedDeviationPatterns.length; i++) {
      expect(resultSet1.detectedDeviationPatterns[i]).toEqual(resultSet2.detectedDeviationPatterns[i]);
    }

    expect(resultSet1.datasetHash).toBe(resultSet2.datasetHash);

    expect(resultSet1.analysisId).toBe(resultSet2.analysisId);
  });
});