import { analyzeProcessDeviationAndCorrelateWithContracts } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-831
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 営業担当者が0人の場合、空の相関分析結果を返す', () => {
    const input = {
      salesRepresentatives: [],
      processStandard: {
        stages: ['Initial Contact', 'Proposal', 'Negotiation', 'Contract'],
        kpiCriteria: {
          'Initial Contact': { targetFrequency: 2, minDuration: 5 },
          'Proposal': { targetFrequency: 1, minDuration: 3 },
          'Negotiation': { targetFrequency: 2, minDuration: 7 },
          'Contract': { targetFrequency: 1, minDuration: 1 }
        }
      },
      contractResults: [],
      analysisTimestamp: new Date('2024-06-15T10:30:00Z')
    };

    const result = analyzeProcessDeviationAndCorrelateWithContracts(input);

    expect(result).toEqual({
      correlationPairs: [],
      analysisMetadata: {
        analyzedCount: 0,
        processStandardCount: 4,
        correlationCoefficient: null,
        analysisTimestamp: new Date('2024-06-15T10:30:00Z'),
        datasetHash: null
      },
      deviations: [],
      recommendations: []
    });
  });
});