import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1254
  test('営業プロセス遵守事項が1件のときに判定ロジックが適切に処理される', async () => {
    const startTime = Date.now();

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          patternName: '初期接触時ヒアリング定着パターン',
          successRate: 0.85,
          applicableCustomerType: 'large_enterprise',
          keyActions: ['課題ヒアリング', '経営層接触', '競合分析'],
        },
        {
          patternId: 'pattern_002',
          patternName: '段階的提案推進パターン',
          successRate: 0.78,
          applicableCustomerType: 'mid_market',
          keyActions: ['段階的提案', 'ROI説明', '導入支援'],
        },
        {
          patternId: 'pattern_003',
          patternName: '緊急課題対応パターン',
          successRate: 0.72,
          applicableCustomerType: 'large_enterprise',
          keyActions: ['課題分析', '迅速提案', 'POC実施'],
        },
      ]),
    };

    const businessProcessRequirements = [
      {
        requirementId: 'req_001',
        requirementName: '顧客課題ヒアリング必須',
        complianceLevel: 'mandatory',
        verificationMethod: 'presence_check',
      },
    ];

    const proposalData = {
      proposalId: 'prop_2024_001',
      customerId: 'cust_20240115_001',
      customerName: 'Test Enterprise Co.',
      industryType: 'finance',
      customerScale: 'large_enterprise',
      dealStage: 'initial_discovery',
      proposalContent: {
        targetProblem: '営業プロセスの可視化',
        proposedSolution: 'AIエージェント推奨支援システム導入',
        customerHearingCompleted: true,
        hearingNotes: '顧客課題: 営業ばらつき削減、データ品質向上',
      },
      submissionDate: new Date('2024-01-15T10:30:00Z'),
    };

    const result = await evaluateProposalAppropriateness(
      proposalData,
      businessProcessRequirements,
      mockAIEngine
    );

    const endTime = Date.now();
    const executionTimeMs = endTime - startTime;

    expect(result).toHaveProperty('evaluationId');
    expect(result).toHaveProperty('complianceStatus');
    expect(result).toHaveProperty('evaluationScore');
    expect(result).toHaveProperty('checkItemCount');
    expect(result).toHaveProperty('complianceRate');
    expect(result).toHaveProperty('recommendedApplicablePattern');
    expect(result).toHaveProperty('evaluationTimestamp');

    expect(result.checkItemCount).toBe(1);
    expect(result.complianceRate).toBe(100);
    expect(result.complianceStatus).toBe('compliant');
    expect(result.evaluationScore).toBe(100);

    expect(result.recommendedApplicablePattern).toBeDefined();
    expect(result.recommendedApplicablePattern.patternName).toBe(
      '初期接触時ヒアリング定着パターン'
    );
    expect(result.recommendedApplicablePattern.patternId).toBe('pattern_001');
    expect(result.recommendedApplicablePattern.successRate).toBe(0.85);

    expect(executionTimeMs).toBeLessThanOrEqual(500);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(proposalData);
  });
});