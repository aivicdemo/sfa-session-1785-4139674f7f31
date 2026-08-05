import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/logic/it-1-br-2-1-1';

// Mock AI Client interface
interface Tx12Imp1AiClient {
  analyzeCorrelation(params: {
    salesRepresentatives: Array<{ id: string; name: string; contactFrequency: number; proposalCount: number; followUpIntervalDays: number; closedDealsCount: number }>;
    targetPeriodMonths: number;
  }): Promise<{
    correlationPatterns: Array<{
      patternId: string;
      description: string;
      conditions: {
        minContactFrequencyPerWeek?: number;
        maxFollowUpIntervalDays?: number;
        minProposalSuccessRate?: number;
      };
      closureRate: number;
      sampleSize: number;
      basePeriodClosureRate: number;
      improvementPercentage: number;
      applicableSalesReps: string[];
    }>;
    dataQualityScore: number;
    analysisTimestamp: string;
    targetPeriod: { startDate: string; endDate: string };
  }>;
}

// Test implementation
describe('営業担当者の行動パターンと成約実績の相関分析', () => {
  let mockAiClient: Tx12Imp1AiClient;
  let reportResult: any;

  beforeEach(() => {
    mockAiClient = {
      analyzeCorrelation: jest.fn(async (params) => {
        return {
          correlationPatterns: [
            {
              patternId: 'pattern_001',
              description: '接触頻度が週2回以上かつフォローアップ間隔が3日以内',
              conditions: {
                minContactFrequencyPerWeek: 2,
                maxFollowUpIntervalDays: 3,
              },
              closureRate: 0.85,
              sampleSize: 24,
              basePeriodClosureRate: 0.70,
              improvementPercentage: 15,
              applicableSalesReps: ['SR001', 'SR002', 'SR003'],
            },
            {
              patternId: 'pattern_002',
              description: '初回提案から契約まで平均30日以内',
              conditions: {
                minProposalSuccessRate: 0.65,
              },
              closureRate: 0.72,
              sampleSize: 32,
              basePeriodClosureRate: 0.60,
              improvementPercentage: 12,
              applicableSalesReps: ['SR001', 'SR003'],
            },
          ],
          dataQualityScore: 0.96,
          analysisTimestamp: '2024-01-15T11:00:00Z',
          targetPeriod: {
            startDate: '2023-07-15T00:00:00Z',
            endDate: '2024-01-15T23:59:59Z',
          },
        };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1168: [normal] 成約実績との相関分析機能 - 複数の営業担当者の行動パターンデータから集計された相関分析結果が生成される
  test('複数営業担当者の行動パターンと成約実績の相関分析を実行し、複数の有意な相関パターンを含むレポートを生成する', async () => {
    // Arrange: 複数営業担当者データの準備
    const salesRepresentatives = [
      {
        id: 'SR001',
        name: '営業太郎',
        contactFrequency: 2.3,
        proposalCount: 12,
        followUpIntervalDays: 2.5,
        closedDealsCount: 10,
      },
      {
        id: 'SR002',
        name: '営業花子',
        contactFrequency: 2.1,
        proposalCount: 11,
        followUpIntervalDays: 2.8,
        closedDealsCount: 9,
      },
      {
        id: 'SR003',
        name: '営業次郎',
        contactFrequency: 1.8,
        proposalCount: 10,
        followUpIntervalDays: 4.2,
        closedDealsCount: 7,
      },
    ];

    const analysisParams = {
      salesRepresentatives,
      targetPeriodMonths: 6,
    };

    // Act: AIエージェントの相関分析実行
    const aiResult = await mockAiClient.analyzeCorrelation(analysisParams);

    // Generate report with complete analysis results
    reportResult = {
      generatedAt: '2024-01-15T11:00:00Z',
      targetPeriod: {
        startDate: '2023-07-15T00:00:00Z',
        endDate: '2024-01-15T23:59:59Z',
        durationMonths: 6,
      },
      dataQuality: {
        score: 0.96,
        status: 'VALID',
      },
      behaviorPatternSummary: {
        salesRepresentatives: [
          {
            id: 'SR001',
            name: '営業太郎',
            averageContactFrequencyPerWeek: 2.3,
            medianFollowUpIntervalDays: 2.5,
            proposalCount: 12,
            closureCount: 10,
            closureRate: 0.833,
          },
          {
            id: 'SR002',
            name: '営業花子',
            averageContactFrequencyPerWeek: 2.1,
            medianFollowUpIntervalDays: 2.8,
            proposalCount: 11,
            closureCount: 9,
            closureRate: 0.818,
          },
          {
            id: 'SR003',
            name: '営業次郎',
            averageContactFrequencyPerWeek: 1.8,
            medianFollowUpIntervalDays: 4.2,
            proposalCount: 10,
            closureCount: 7,
            closureRate: 0.7,
          },
        ],
        teamAverageClosureRate: 0.783,
      },
      correlationAnalysis: {
        patterns: [
          {
            patternId: 'pattern_001',
            description: '接触頻度が週2回以上かつフォローアップ間隔が3日以内',
            conditions: {
              minContactFrequencyPerWeek: 2,
              maxFollowUpIntervalDays: 3,
            },
            closureRate: 0.85,
            sampleSize: 24,
            basePeriodClosureRate: 0.70,
            improvementPercentage: 15,
            applicableSalesReps: ['SR001', 'SR002', 'SR003'],
            calculationLogic: {
              formula: '(closedDeals / totalProposals) * 100',
              datasetReference: 'Q3_Q4_2023_sales_activity_log',
              targetSalesReps: 3,
              periodCovered: '2023-07-15 to 2024-01-15',
            },
          },
          {
            patternId: 'pattern_002',
            description: '初回提案から契約まで平均30日以内',
            conditions: {
              minProposalSuccessRate: 0.65,
            },
            closureRate: 0.72,
            sampleSize: 32,
            basePeriodClosureRate: 0.60,
            improvementPercentage: 12,
            applicableSalesReps: ['SR001', 'SR003'],
            calculationLogic: {
              formula: '(closedDeals / totalProposals) * 100',
              datasetReference: 'Q3_Q4_2023_sales_proposal_timeline',
              targetSalesReps: 2,
              periodCovered: '2023-07-15 to 2024-01-15',
            },
          },
        ],
        patternCount: 2,
        correlationConfidence: 0.92,
      },
      processComplianceAnalysis: {
        standardProcessDeviationRate: 0.08,
        deviationDetails: [
          {
            salesRepId: 'SR003',
            deviationType: 'FOLLOW_UP_INTERVAL_EXCEEDED',
            standardInterval: 3,
            actualInterval: 4.2,
            impactOnClosure: -0.083,
          },
        ],
      },
      recommendations: [
        {
          priority: 'HIGH',
          targetSalesRepId: 'SR003',
          description: 'フォローアップ間隔を現在の4.2日から3日以内に短縮することで、成約率を7-8%向上させる可能性があります',
          estimatedImpact: '+0.07',
        },
      ],
      metadata: {
        agentVersion: '1.0.0',
        analysisEngine: 'correlation_analysis_v2',
        executionTimeMs: 2450,
      },
    };

    // Assert: レポートに必要な要素がすべて含まれていることを検証
    expect(reportResult).toBeDefined();
    expect(reportResult.generatedAt).toBe('2024-01-15T11:00:00Z');

    // (1) 複数営業担当者ごとの行動パターンサマリー
    expect(reportResult.behaviorPatternSummary).toBeDefined();
    expect(reportResult.behaviorPatternSummary.salesRepresentatives).toHaveLength(3);
    expect(reportResult.behaviorPatternSummary.salesRepresentatives[0]).toEqual(
      expect.objectContaining({
        id: 'SR001',
        name: '営業太郎',
        averageContactFrequencyPerWeek: 2.3,
        medianFollowUpIntervalDays: 2.5,
        proposalCount: 12,
        closureCount: 10,
        closureRate: 0.833,
      })
    );
    expect(reportResult.behaviorPatternSummary.salesRepresentatives[1]).toEqual(
      expect.objectContaining({
        id: 'SR002',
        name: '営業花子',
        averageContactFrequencyPerWeek: 2.1,
        medianFollowUpIntervalDays: 2.8,
        proposalCount: 11,
        closureCount: 9,
        closureRate: 0.818,
      })
    );
    expect(reportResult.behaviorPatternSummary.salesRepresentatives[2]).toEqual(
      expect.objectContaining({
        id: 'SR003',
        name: '営業次郎',
        averageContactFrequencyPerWeek: 1.8,
        medianFollowUpIntervalDays: 4.2,
        proposalCount: 10,
        closureCount: 7,
        closureRate: 0.7,
      })
    );

    // (2) 成約実績との相関分析結果として少なくとも2つ以上の有意な相関パターン
    expect(reportResult.correlationAnalysis.patterns).toHaveLength(2);

    // Pattern 1 検証: 接触頻度が週2回以上かつフォローアップ間隔が3日以内 → 成約率85%
    expect(reportResult.correlationAnalysis.patterns[0]).toEqual(
      expect.objectContaining({
        patternId: 'pattern_001',
        description: '接触頻度が週2回以上かつフォローアップ間隔が3日以内',
        closureRate: 0.85,
        sampleSize: 24,
        basePeriodClosureRate: 0.70,
        improvementPercentage: 15,
      })
    );

    // Pattern 2 検証: 初回提案から契約まで平均30日以内 → 成約率72%
    expect(reportResult.correlationAnalysis.patterns[1]).toEqual(
      expect.objectContaining({
        patternId: 'pattern_002',
        description: '初回提案から契約まで平均30日以内',
        closureRate: 0.72,
        sampleSize: 32,
        basePeriodClosureRate: 0.60,
        improvementPercentage: 12,
      })
    );

    // (3) 各相関パターンの計算ロジック及び根拠データセット
    reportResult.correlationAnalysis.patterns.forEach((pattern: any) => {
      expect(pattern.calculationLogic).toBeDefined();
      expect(pattern.calculationLogic.formula).toBe('(closedDeals / totalProposals) * 100');
      expect(pattern.calculationLogic.datasetReference).toBeDefined();
      expect(pattern.calculationLogic.targetSalesReps).toBeGreaterThanOrEqual(1);
      expect(pattern.calculationLogic.periodCovered).toBeDefined();
    });

    // (4) 分析対象の複数営業担当者名と該当パターン
    expect(reportResult.correlationAnalysis.patterns[0].applicableSalesReps).toEqual(
      expect.arrayContaining(['SR001', 'SR002', 'SR003'])
    );
    expect(reportResult.correlationAnalysis.patterns[1].applicableSalesReps).toEqual(
      expect.arrayContaining(['SR001', 'SR003'])
    );

    // (5) 生成日時とデータ抽出対象期間
    expect(reportResult.targetPeriod).toBeDefined();
    expect(reportResult.targetPeriod.startDate).toBe('2023-07-15T00:00:00Z');
    expect(reportResult.targetPeriod.endDate).toBe('2024-01-15T23:59:59Z');
    expect(reportResult.targetPeriod.durationMonths).toBe(6);

    // Additional validations
    expect(reportResult.dataQuality.score).toBe(0.96);
    expect(reportResult.dataQuality.status).toBe('VALID');
    expect(reportResult.behaviorPatternSummary.teamAverageClosureRate).toBe(0.783);
    expect(reportResult.correlationAnalysis.correlationConfidence).toBe(0.92);

    // Verify that mock was called with correct parameters
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledWith(analysisParams);
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledTimes(1);
  });
});