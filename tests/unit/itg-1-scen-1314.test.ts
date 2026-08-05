import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/ai-client';
import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';

describe('営業データ分析から乖離検出までの自律実行 AIエージェント', () => {
  let mockAiClient: jest.Mocked<Tx12Imp1AiClient>;
  let auditLog: any[];

  beforeEach(() => {
    auditLog = [];
    mockAiClient = {
      extractSalesDataByMonth: jest.fn(),
      executeDataQualityCheck: jest.fn(),
      analyzeBehaviorPatterns: jest.fn(),
      analyzeProcessDeviation: jest.fn(),
      analyzeClosureCorrelation: jest.fn(),
      generateImprovementProposals: jest.fn(),
      recordAuditEvent: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SCEN-1314: 営業データ分析から乖離検出までの自律実行 AIエージェント - 契約どおり改善提案を生成', async () => {
    // Arrange: フェイクAIクライアントの各ステップ応答を構成
    const mockDataExtractionResponse = {
      period: '2024-01',
      salesRepresentatives: [
        { id: 'rep-001', name: '営業担当者A' },
        { id: 'rep-002', name: '営業担当者B' },
        { id: 'rep-003', name: '営業担当者C' },
        { id: 'rep-004', name: '営業担当者D' },
        { id: 'rep-005', name: '営業担当者E' },
      ],
      closureCount: 50,
      contactRecordCount: 200,
    };

    const mockQualityCheckResponse = {
      qualityScore: 98,
      missingValues: 0,
      formatErrors: 0,
      duplicateDetection: 0,
      timestamp: '2024-01-15T10:00:00Z',
    };

    const mockBehaviorPatternResponse = {
      contactFrequencyDistribution: {
        'rep-001': { mean: 12.5, stdDev: 2.1 },
        'rep-002': { mean: 14.2, stdDev: 1.8 },
        'rep-003': { mean: 10.8, stdDev: 2.5 },
        'rep-004': { mean: 13.1, stdDev: 2.0 },
        'rep-005': { mean: 9.5, stdDev: 3.2 },
      },
      proposalStandardizationDegree: {
        'rep-001': 92,
        'rep-002': 95,
        'rep-003': 85,
        'rep-004': 88,
        'rep-005': 78,
      },
      followupIntervalValidity: {
        'rep-001': true,
        'rep-002': true,
        'rep-003': false,
        'rep-004': true,
        'rep-005': false,
      },
    };

    const mockProcessDeviationResponse = {
      complianceRate: 95,
      deviationCount: 3,
      deviationDetails: [
        {
          stepName: 'ニーズ把握',
          deviationRate: 8,
          affectedRepCount: 2,
        },
        {
          stepName: '折衝',
          deviationRate: 5,
          affectedRepCount: 1,
        },
        {
          stepName: 'フォローアップ',
          deviationRate: 7,
          affectedRepCount: 2,
        },
      ],
    };

    const mockClosureCorrelationResponse = {
      successPatterns: [
        {
          patternId: 'success-pattern-1',
          description: '初期接触後3日以内にニーズ把握を完了し提案に進める',
          closureRate: 62,
          sampleSize: 28,
        },
        {
          patternId: 'success-pattern-2',
          description: '提案から成約まで平均7日以内でフォローアップを実行',
          closureRate: 58,
          sampleSize: 22,
        },
      ],
      correlationCoefficient: 0.78,
    };

    const mockImprovementProposalsResponse = {
      processModifications: [
        {
          proposalId: 'proposal-proc-001',
          stepName: 'ニーズ把握',
          modification: 'ニーズ把握ステップの時間短縮',
          expectedBenefit: '成約率3%向上',
          rationale: '成功パターン分析から、短時間での完了が成約率向上に相関',
        },
      ],
      individualGuidanceTargets: [
        {
          proposalId: 'proposal-guid-001',
          salesRepId: 'rep-003',
          salesRepName: '営業担当者C',
          declineReason: 'ニーズ把握ステップ遵守率低下、フォローアップ間隔不適切',
          guidanceContent: '標準プロセス再教育、フォローアップ間隔の最適化',
          expectedImpactOnClosureRate: 4,
        },
        {
          proposalId: 'proposal-guid-002',
          salesRepId: 'rep-005',
          salesRepName: '営業担当者E',
          declineReason: '接触頻度低下、提案標準化度低い',
          guidanceContent: '接触頻度の増加指導、成功パターンテンプレート適用',
          expectedImpactOnClosureRate: 5,
        },
      ],
      newSuccessPatterns: [
        {
          patternId: 'new-pattern-001',
          patternCharacteristic: '複数回接触後の小口提案から段階的に金額を増加させるアプローチ',
          applicableTargets: ['rep-004', 'rep-002'],
          expectedClosureRateImprovement: 7,
        },
      ],
    };

    mockAiClient.extractSalesDataByMonth.mockResolvedValue(
      mockDataExtractionResponse
    );
    mockAiClient.executeDataQualityCheck.mockResolvedValue(
      mockQualityCheckResponse
    );
    mockAiClient.analyzeBehaviorPatterns.mockResolvedValue(
      mockBehaviorPatternResponse
    );
    mockAiClient.analyzeProcessDeviation.mockResolvedValue(
      mockProcessDeviationResponse
    );
    mockAiClient.analyzeClosureCorrelation.mockResolvedValue(
      mockClosureCorrelationResponse
    );
    mockAiClient.generateImprovementProposals.mockResolvedValue(
      mockImprovementProposalsResponse
    );

    mockAiClient.recordAuditEvent.mockImplementation((event) => {
      auditLog.push(event);
      return Promise.resolve();
    });

    // Act: orchestrator関数を実行
    const result = await runTx12Imp1Agent(
      {
        trigger: '月次営業会議',
        targetPeriod: '2024-01',
        managerId: 'mgr-001',
        analysisTimestamp: '2024-01-15T10:00:00Z',
      },
      mockAiClient
    );

    // Assert: AIエージェントが各ステップを順序通りに実行したことを確認
    expect(mockAiClient.extractSalesDataByMonth).toHaveBeenCalledWith(
      '2024-01'
    );
    expect(mockAiClient.executeDataQualityCheck).toHaveBeenCalledWith(
      mockDataExtractionResponse
    );
    expect(mockAiClient.analyzeBehaviorPatterns).toHaveBeenCalledWith(
      mockDataExtractionResponse
    );
    expect(mockAiClient.analyzeProcessDeviation).toHaveBeenCalledWith(
      mockDataExtractionResponse,
      mockBehaviorPatternResponse
    );
    expect(mockAiClient.analyzeClosureCorrelation).toHaveBeenCalledWith(
      mockDataExtractionResponse,
      mockBehaviorPatternResponse,
      mockProcessDeviationResponse
    );
    expect(mockAiClient.generateImprovementProposals).toHaveBeenCalledWith(
      mockDataExtractionResponse,
      mockQualityCheckResponse,
      mockBehaviorPatternResponse,
      mockProcessDeviationResponse,
      mockClosureCorrelationResponse
    );

    // Assert: 生成されたレポートが契約要件を満たすことを確認
    expect(result).toBeDefined();
    expect(result.period).toBe('2024-01');
    expect(result.analysisExecutionId).toBeDefined();
    expect(result.managerId).toBe('mgr-001');
    expect(result.analysisTimestamp).toBe('2024-01-15T10:00:00Z');

    // Assert: 品質チェック結果が正確に統合されたことを確認
    expect(result.qualityCheckResult).toBeDefined();
    expect(result.qualityCheckResult.qualityScore).toBe(98);
    expect(result.qualityCheckResult.missingValues).toBe(0);
    expect(result.qualityCheckResult.formatErrors).toBe(0);

    // Assert: 行動パターン分析結果が統合されたことを確認
    expect(result.behaviorPatternAnalysis).toBeDefined();
    expect(result.behaviorPatternAnalysis.contactFrequencyDistribution).toEqual(
      mockBehaviorPatternResponse.contactFrequencyDistribution
    );

    // Assert: プロセス乖離分析結果が統合されたことを確認
    expect(result.processDeviationAnalysis).toBeDefined();
    expect(result.processDeviationAnalysis.complianceRate).toBe(95);
    expect(result.processDeviationAnalysis.deviationCount).toBe(3);
    expect(result.processDeviationAnalysis.deviationDetails).toHaveLength(3);
    expect(result.processDeviationAnalysis.deviationDetails[0].stepName).toBe(
      'ニーズ把握'
    );
    expect(result.processDeviationAnalysis.deviationDetails[0].deviationRate).toBe(
      8
    );

    // Assert: 成約相関分析結果が統合されたことを確認
    expect(result.closureCorrelationAnalysis).toBeDefined();
    expect(result.closureCorrelationAnalysis.successPatterns).toHaveLength(2);
    expect(
      result.closureCorrelationAnalysis.successPatterns[0].closureRate
    ).toBe(62);
    expect(
      result.closureCorrelationAnalysis.successPatterns[1].closureRate
    ).toBe(58);

    // Assert: 改善提案がすべて含まれることを確認
    expect(result.improvementProposals).toBeDefined();

    // Assert: プロセス修正提案が正確に含まれることを確認
    expect(result.improvementProposals.processModifications).toHaveLength(1);
    expect(result.improvementProposals.processModifications[0].stepName).toBe(
      'ニーズ把握'
    );
    expect(
      result.improvementProposals.processModifications[0].modification
    ).toBe('ニーズ把握ステップの時間短縮');
    expect(
      result.improvementProposals.processModifications[0].expectedBenefit
    ).toBe('成約率3%向上');

    // Assert: 個別指導対象者が正確に含まれることを確認
    expect(result.improvementProposals.individualGuidanceTargets).toHaveLength(
      2
    );
    expect(
      result.improvementProposals.individualGuidanceTargets[0].salesRepId
    ).toBe('rep-003');
    expect(
      result.improvementProposals.individualGuidanceTargets[0].salesRepName
    ).toBe('営業担当者C');
    expect(
      result.improvementProposals.individualGuidanceTargets[0]
        .expectedImpactOnClosureRate
    ).toBe(4);
    expect(
      result.improvementProposals.individualGuidanceTargets[1].salesRepId
    ).toBe('rep-005');
    expect(
      result.improvementProposals.individualGuidanceTargets[1]
        .expectedImpactOnClosureRate
    ).toBe(5);

    // Assert: 新規成功パターンが正確に含まれることを確認
    expect(result.improvementProposals.newSuccessPatterns).toHaveLength(1);
    expect(result.improvementProposals.newSuccessPatterns[0].patternId).toBe(
      'new-pattern-001'
    );
    expect(
      result.improvementProposals.newSuccessPatterns[0].patternCharacteristic
    ).toContain('複数回接触後の小口提案');
    expect(
      result.improvementProposals.newSuccessPatterns[0].expectedClosureRateImprovement
    ).toBe(7);

    // Assert: 各提案が根拠データを参照していることを確認
    expect(
      result.improvementProposals.processModifications[0].rationale
    ).toBeDefined();
    expect(
      result.improvementProposals.individualGuidanceTargets[0].declineReason
    ).toContain('ニーズ把握ステップ');

    // Assert: レポートが計算ロジック説明を含むことを確認
    expect(result.calculationLogicExplanation).toBeDefined();
    expect(result.calculationLogicExplanation.qualityCheckFormula).toBeDefined();
    expect(
      result.calculationLogicExplanation.correlationAnalysisMethod
    ).toBeDefined();
    expect(
      result.calculationLogicExplanation.proposalGenerationAlgorithm
    ).toBeDefined();

    // Assert: 各分析ステップの入出力データセット参照が記録されたことを確認
    expect(result.analysisStepReferences).toBeDefined();
    expect(result.analysisStepReferences.dataExtraction).toBeDefined();
    expect(result.analysisStepReferences.qualityCheck).toBeDefined();
    expect(result.analysisStepReferences.behaviorPatternAnalysis).toBeDefined();
    expect(result.analysisStepReferences.processDeviationAnalysis).toBeDefined();
    expect(result.analysisStepReferences.closureCorrelationAnalysis).toBeDefined();
    expect(
      result.analysisStepReferences.improvementProposalGeneration
    ).toBeDefined();

    // Assert: 監査ログから自律アクションが順序通りに実行されたことを確認
    expect(auditLog.length).toBeGreaterThanOrEqual(7);
    expect(auditLog[0].actionType).toBe('trigger_verified');
    expect(auditLog[0].trigger).toBe('月次営業会議');
    expect(auditLog[1].actionType).toBe('data_extraction_initiated');
    expect(auditLog[2].actionType).toBe('quality_check_executed');
    expect(auditLog[3].actionType).toBe('behavior_pattern_analysis_executed');
    expect(auditLog[4].actionType).toBe('process_deviation_analysis_executed');
    expect(auditLog[5].actionType).toBe('closure_correlation_analysis_executed');
    expect(auditLog[6].actionType).toBe('improvement_proposal_generated');

    // Assert: すべての監査ログが管理者IDと実行IDを含むことを確認
    auditLog.forEach((entry) => {
      expect(entry.managerId).toBe('mgr-001');
      expect(entry.executionId).toBe(result.analysisExecutionId);
    });

    // Assert: フェイククライアントの全要求が適切に送信されたことを確認
    expect(mockAiClient.extractSalesDataByMonth).toHaveBeenCalledTimes(1);
    expect(mockAiClient.executeDataQualityCheck).toHaveBeenCalledTimes(1);
    expect(mockAiClient.analyzeBehaviorPatterns).toHaveBeenCalledTimes(1);
    expect(mockAiClient.analyzeProcessDeviation).toHaveBeenCalledTimes(1);
    expect(mockAiClient.analyzeClosureCorrelation).toHaveBeenCalledTimes(1);
    expect(mockAiClient.generateImprovementProposals).toHaveBeenCalledTimes(1);

    // Assert: 生成されたレポートが営業管理者による検証可能な形式であることを確認
    expect(result.analysisInputDataset).toBeDefined();
    expect(result.analysisInputDataset.extractedData).toEqual(
      mockDataExtractionResponse
    );
    expect(result.analysisInputDataset.processStandard).toBeDefined();
    expect(result.analysisInputDataset.historicalClosureData).toBeDefined();
  });
});