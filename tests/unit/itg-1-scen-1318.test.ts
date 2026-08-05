import { runTx12Imp1Agent } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1318
  test('異常な成約率低下や行動パターンの急変が検出された場合、人への引き継ぎ前に副作用が確定されない', async () => {
    fetchMock.resetMocks();

    // テスト用の営業データベース: 異常な成約率低下（前月比60%以上）と行動パターンの急変
    const monthlyDatasetId = 'dataset_2024_11_anomaly';
    const previousMonthContractRate = 0.50; // 前月: 50%
    const currentMonthContractRate = 0.20; // 当月: 20% → 60%の低下
    const contractRateLossPercent = 60; // 前月比60%低下

    const salespersonId = 'sp_001_anomaly';
    const previousMonthTouchFrequency = 12; // 前月: 月12回接触
    const currentMonthTouchFrequency = 5; // 当月: 月5回 → 行動パターン急変
    const proposalContentChangePercent = 45; // 提案内容の変化率45%
    const followupIntervalChangeDays = 18; // フォローアップ間隔が18日延長（急変）

    const processStandardDeviationPercent = 25; // 標準プロセスから25%乖離

    // 1. 営業データ品質チェック - クオリティスコア98%（基準値95%以上でパス）
    const dataQualityScore = 98;
    const dataQualityThreshold = 95;
    const dataQualityCheckResult = {
      score: dataQualityScore,
      passed: dataQualityScore >= dataQualityThreshold,
      missingValuesCount: 2,
      formatErrorsCount: 0,
      duplicateDetectionCount: 1,
      datasetId: monthlyDatasetId,
    };

    // 2. 営業担当者ごとの行動パターン分析結果
    const behaviorPatternAnalysisResult = {
      salespersonId: salespersonId,
      touchFrequencyPerMonth: currentMonthTouchFrequency,
      touchFrequencyPreviousMonth: previousMonthTouchFrequency,
      touchFrequencyChangePercent: ((previousMonthTouchFrequency - currentMonthTouchFrequency) / previousMonthTouchFrequency) * 100,
      proposalContentChangePercent: proposalContentChangePercent,
      followupIntervalChangeDays: followupIntervalChangeDays,
      analysisCompleted: true,
    };

    // 3. 営業プロセス標準書との乖離分析結果
    const processComplianceDeviationResult = {
      salespersonId: salespersonId,
      standardProcessDeviationPercent: processStandardDeviationPercent,
      deviationThreshold: 20,
      isDeviationDetected: processStandardDeviationPercent >= 20,
      deviationDetails: [
        { step: 'initial_contact', deviationPercent: 30 },
        { step: 'proposal', deviationPercent: 25 },
        { step: 'negotiation', deviationPercent: 20 },
        { step: 'contract', deviationPercent: 25 },
      ],
    };

    // 4. 成約相関分析処理 - 異常な成約率低下と行動パターン急変を検出
    const contractCorrelationAnalysisResult = {
      salespersonId: salespersonId,
      currentMonthContractRate: currentMonthContractRate,
      previousMonthContractRate: previousMonthContractRate,
      contractRateLossPercent: contractRateLossPercent,
      contractRateLossThreshold: 30, // 前月比30%以上低下で異常と判定
      isContractRateLossAbnormal: contractRateLossPercent >= 30,
      behaviorPatternChangeDetected: true,
      correlationAnalysisComplete: true,
      datasetReference: monthlyDatasetId,
      calculationLogic: 'contract_rate_loss_calc_v1',
    };

    // エスカレーション判定: 異常な成約率低下（60%）と行動パターン急変が検出
    const escalationCondition =
      contractCorrelationAnalysisResult.isContractRateLossAbnormal &&
      contractCorrelationAnalysisResult.behaviorPatternChangeDetected;

    const escalationResult = {
      isEscalationTriggered: escalationCondition,
      escalationReason: '異常な成約率低下や行動パターンの急変',
      requiresManualInvestigation: true,
      partialAnalysisData: {
        datasetId: contractCorrelationAnalysisResult.datasetReference,
        calculationLogic: contractCorrelationAnalysisResult.calculationLogic,
        contractRateLossPercent: contractCorrelationAnalysisResult.contractRateLossPercent,
        behaviorPatternChangeDetected: contractCorrelationAnalysisResult.behaviorPatternChangeDetected,
        processDeviationPercent: processComplianceDeviationResult.standardProcessDeviationPercent,
      },
    };

    // Mock AI Client: データ品質チェック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        step: 'data_quality_check',
        result: dataQualityCheckResult,
      }),
      { status: 200 }
    );

    // Mock AI Client: 行動パターン分析
    fetchMock.mockResponseOnce(
      JSON.stringify({
        step: 'behavior_pattern_analysis',
        result: behaviorPatternAnalysisResult,
      }),
      { status: 200 }
    );

    // Mock AI Client: 乖離検出
    fetchMock.mockResponseOnce(
      JSON.stringify({
        step: 'process_deviation_detection',
        result: processComplianceDeviationResult,
      }),
      { status: 200 }
    );

    // Mock AI Client: 成約相関分析
    fetchMock.mockResponseOnce(
      JSON.stringify({
        step: 'contract_correlation_analysis',
        result: contractCorrelationAnalysisResult,
      }),
      { status: 200 }
    );

    // Mock AI Client: エスカレーション判定
    fetchMock.mockResponseOnce(
      JSON.stringify({
        step: 'escalation_judgment',
        result: escalationResult,
      }),
      { status: 200 }
    );

    // Orchestrator実行: トリガー = 月次営業会議
    const orchestratorInput = {
      triggerType: 'monthly_sales_meeting',
      datasetId: monthlyDatasetId,
      targetSalespersonIds: [salespersonId],
      qualityScoreThreshold: dataQualityThreshold,
      contractRateLossThresholdPercent: 30,
      behaviorPatternChangeThreshold: 15,
      processDeviationThreshold: 20,
    };

    const orchestratorResult = await runTx12Imp1Agent(orchestratorInput);

    // 検証1: データ品質チェックがパスしている（スコア98% >= 95%）
    expect(orchestratorResult.steps.dataQualityCheckStep.passed).toBe(true);
    expect(orchestratorResult.steps.dataQualityCheckStep.score).toBe(98);

    // 検証2: 行動パターン分析が完了し、接触頻度の低下が記録されている
    expect(orchestratorResult.steps.behaviorPatternAnalysisStep.completed).toBe(true);
    expect(orchestratorResult.steps.behaviorPatternAnalysisStep.touchFrequencyPerMonth).toBe(5);
    expect(orchestratorResult.steps.behaviorPatternAnalysisStep.touchFrequencyChangePercent).toBe(
      ((12 - 5) / 12) * 100 // 約58.33%
    );

    // 検証3: 乖離分析で営業担当者の行動が標準プロセスから25%乖離していることが検出される
    expect(orchestratorResult.steps.processDeviationDetectionStep.isDeviationDetected).toBe(true);
    expect(orchestratorResult.steps.processDeviationDetectionStep.standardProcessDeviationPercent).toBe(25);

    // 検証4: 成約相関分析で前月比60%の成約率低下が検出される
    expect(orchestratorResult.steps.contractCorrelationAnalysisStep.contractRateLossPercent).toBe(60);
    expect(orchestratorResult.steps.contractCorrelationAnalysisStep.isContractRateLossAbnormal).toBe(true);

    // 検証5: エスカレーション判定が『異常な成約率低下や行動パターンの急変』条件に合致
    expect(orchestratorResult.escalationJudgment.isEscalationTriggered).toBe(true);
    expect(orchestratorResult.escalationJudgment.escalationReason).toBe('異常な成約率低下や行動パターンの急変');

    // 検証6: 人への引き継ぎリクエストが作成され、以下を含むこと
    expect(orchestratorResult.handoverRequest).toBeDefined();
    expect(orchestratorResult.handoverRequest.datasetId).toBe(monthlyDatasetId);
    expect(orchestratorResult.handoverRequest.calculationLogic).toBe('contract_rate_loss_calc_v1');
    expect(orchestratorResult.handoverRequest.contractRateLossPercent).toBe(60);
    expect(orchestratorResult.handoverRequest.behaviorPatternChangeDetected).toBe(true);
    expect(orchestratorResult.handoverRequest.processDeviationPercent).toBe(25);

    // 検証7: 副作用が確定されていない - 個人への通知が行われていない
    expect(orchestratorResult.sideEffectsConfirmed).toBe(false);
    expect(orchestratorResult.personalNotificationSent).toBe(false);

    // 検証8: 改善提案の自動実行が停止している
    expect(orchestratorResult.improvementProposalAutoExecuted).toBe(false);

    // 検証9: 処理状態が『人の確認待ち』に遷移
    expect(orchestratorResult.processingState).toBe('awaiting_manual_investigation');

    // 検証10: レポート生成が一時停止
    expect(orchestratorResult.reportGenerationStatus).toBe('suspended');

    // 検証11: 営業管理者への引き継ぎが実行されたことを確認
    expect(orchestratorResult.handoverToManager).toBe(true);
    expect(orchestratorResult.handoverTimestamp).toBeDefined();
  });
});