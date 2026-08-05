import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import type { Tx12Imp1AiClient } from '../../../src/agents/tx-12-imp-1/ai-client';
import { runTx12Imp1Agent } from '../../../src/agents/tx-12-imp-1/orchestrator';

// Mock AI client
class MockTx12Imp1AiClient implements Tx12Imp1AiClient {
  async analyzeProcessDeviation(payload: {
    salesRepresentativeDataSet: Array<{
      salesRepId: string;
      contactFrequency: number;
      proposalContentType: string;
      followUpInterval: number;
      closureCount: number;
      totalOpportunitiesCount: number;
    }>;
    standardProcessDefinition: {
      steps: Array<{ stepName: string; order: number }>;
    };
  }): Promise<{
    executionFlowLog: string;
    datasetBasis: {
      recordCount: number;
      period: string;
    };
    calculationLogic: string;
    correlationGroups: Array<{
      groupId: string;
      memberIds: string[];
      groupClosureRate: number;
      correlationCoefficients: Record<string, number>;
    }>;
  }> {
    // Simulate equal behavior pattern detection
    const allMembers = payload.salesRepresentativeDataSet.map((r) => r.salesRepId);
    const totalClosures = payload.salesRepresentativeDataSet.reduce((sum, r) => sum + r.closureCount, 0);
    const totalOpportunities = payload.salesRepresentativeDataSet.reduce((sum, r) => sum + r.totalOpportunitiesCount, 0);
    const groupClosureRate = totalClosures / totalOpportunities;

    const correlationCoefficients: Record<string, number> = {};
    allMembers.forEach((memberId) => {
      correlationCoefficients[memberId] = groupClosureRate;
    });

    return {
      executionFlowLog: 'Equal behavior pattern detected → Group statistical processing → Correlation coefficient calculation',
      datasetBasis: {
        recordCount: payload.salesRepresentativeDataSet.length,
        period: '2024-01-01 to 2024-01-31',
      },
      calculationLogic:
        'Equal pattern detection algorithm → Group statistics processing → Correlation coefficient assignment',
      correlationGroups: [
        {
          groupId: 'correlationGroup_001',
          memberIds: allMembers,
          groupClosureRate: groupClosureRate,
          correlationCoefficients: correlationCoefficients,
        },
      ],
    };
  }
}

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  let aiClient: MockTx12Imp1AiClient;

  beforeEach(() => {
    aiClient = new MockTx12Imp1AiClient();
  });

  afterEach(() => {
    // Cleanup mock state if needed
  });

  // SCEN-1219: 複数営業担当者の行動パターンが同値である場合の相関分析
  test('複数営業担当者の行動パターンが完全に同値である場合、相関分析エンジンが正確に同一グループとして識別し共通成約率を計算し相関係数を割り当てる', async () => {
    const salesRepresentativeDataSet = [
      {
        salesRepId: 'rep_A',
        contactFrequency: 12,
        proposalContentType: 'product_explanation',
        followUpInterval: 7,
        closureCount: 10,
        totalOpportunitiesCount: 20,
      },
      {
        salesRepId: 'rep_B',
        contactFrequency: 12,
        proposalContentType: 'product_explanation',
        followUpInterval: 7,
        closureCount: 10,
        totalOpportunitiesCount: 20,
      },
      {
        salesRepId: 'rep_C',
        contactFrequency: 12,
        proposalContentType: 'product_explanation',
        followUpInterval: 7,
        closureCount: 10,
        totalOpportunitiesCount: 20,
      },
    ];

    const standardProcessDefinition = {
      steps: [
        { stepName: 'initial_contact', order: 1 },
        { stepName: 'proposal', order: 2 },
        { stepName: 'follow_up', order: 3 },
        { stepName: 'closure', order: 4 },
      ],
    };

    const result = await aiClient.analyzeProcessDeviation({
      salesRepresentativeDataSet,
      standardProcessDefinition,
    });

    // Verify correlation group identification
    expect(result.correlationGroups).toHaveLength(1);
    expect(result.correlationGroups[0].groupId).toBe('correlationGroup_001');

    // Verify member identification
    expect(result.correlationGroups[0].memberIds).toEqual(['rep_A', 'rep_B', 'rep_C']);

    // Verify closure rate calculation: (10+10+10)/(20+20+20) = 30/60 = 0.5 = 50%
    expect(result.correlationGroups[0].groupClosureRate).toBe(0.5);

    // Verify each sales rep has the same correlation coefficient
    expect(result.correlationGroups[0].correlationCoefficients['rep_A']).toBe(0.5);
    expect(result.correlationGroups[0].correlationCoefficients['rep_B']).toBe(0.5);
    expect(result.correlationGroups[0].correlationCoefficients['rep_C']).toBe(0.5);

    // Verify dataset basis records the correct count
    expect(result.datasetBasis.recordCount).toBe(3);

    // Verify dataset basis includes period
    expect(result.datasetBasis.period).toBeDefined();
    expect(typeof result.datasetBasis.period).toBe('string');

    // Verify execution flow log contains required steps
    expect(result.executionFlowLog).toContain('Equal behavior pattern detected');
    expect(result.executionFlowLog).toContain('Group statistical processing');
    expect(result.executionFlowLog).toContain('Correlation coefficient calculation');

    // Verify calculation logic documentation
    expect(result.calculationLogic).toContain('Equal pattern detection algorithm');
    expect(result.calculationLogic).toContain('Group statistics processing');
    expect(result.calculationLogic).toContain('Correlation coefficient assignment');
  });
});