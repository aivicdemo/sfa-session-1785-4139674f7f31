import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeCorrelationWithZeroClosures } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  let auditLog: Array<{
    timestamp: string;
    action: string;
    inputDatasetSize: number;
    closureCount: number;
    logicVersionId: string;
    analysisConclusion: string;
  }>;

  beforeEach(() => {
    auditLog = [];
  });

  afterEach(() => {
    auditLog = [];
  });

  // SCEN-1170: [normal] 成約実績との相関分析機能 - 成約実績が0件の場合でも相関分析ロジックが実行される
  test('成約実績0件でも相関分析ロジックが正常系で実行され、明示的な分析結論を出力する', () => {
    const salesActivityDataset = [
      {
        salesPersonId: 'sp_001',
        contactCount: 5,
        proposalCount: 3,
        followUpInterval: 2,
      },
      {
        salesPersonId: 'sp_002',
        contactCount: 5,
        proposalCount: 3,
        followUpInterval: 2,
      },
      {
        salesPersonId: 'sp_003',
        contactCount: 5,
        proposalCount: 2,
        followUpInterval: 3,
      },
    ];

    const closureDataset: Array<{
      salesPersonId: string;
      closureDate: string;
      closureAmount: number;
    }> = [];

    const analysisExecutionDateTime = '2024-01-15T09:00:00Z';
    const logicVersionId = 'CORR_ANALYSIS_V2_20240115';

    const result = analyzeCorrelationWithZeroClosures({
      salesActivityDataset,
      closureDataset,
      analysisExecutionDateTime,
      logicVersionId,
      auditLogCallback: (logEntry) => {
        auditLog.push(logEntry);
      },
    });

    expect(result.analysisConclusion).toBe('成約実績0件のため相関パターン抽出対象なし');
    expect(result.correlationPatterns).toEqual([]);
    expect(result.isNormalCompletion).toBe(true);
    expect(result.analysisExecutedSuccessfully).toBe(true);

    expect(result.auditData.inputSalesActivityDatasetCount).toBe(15);
    expect(result.auditData.inputClosureCount).toBe(0);
    expect(result.auditData.analysisExecutionDateTime).toBe('2024-01-15T09:00:00Z');
    expect(result.auditData.logicVersionId).toBe('CORR_ANALYSIS_V2_20240115');

    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].action).toBe('correlation_analysis_executed');
    expect(auditLog[0].inputDatasetSize).toBe(15);
    expect(auditLog[0].closureCount).toBe(0);
    expect(auditLog[0].analysisConclusion).toBe(
      '成約実績0件のため相関パターン抽出対象なし'
    );
    expect(auditLog[0].logicVersionId).toBe('CORR_ANALYSIS_V2_20240115');

    expect(result.subsequentAnalysisStepsExecuted).toEqual({
      behaviorPatternAnalysisExecuted: true,
      processDeviationAnalysisExecuted: true,
      allAnalysisStepsCompleted: true,
    });

    expect(result.reportContent.analysisExecutionDateTime).toBe(
      '2024-01-15T09:00:00Z'
    );
    expect(result.reportContent.targetDatasetItemCount).toBe(15);
    expect(result.reportContent.calculationLogicId).toBe(
      'CORR_ANALYSIS_V2_20240115'
    );
    expect(result.reportContent.conclusionStatement).toBe(
      '成約実績0件のため相関パターン抽出対象なし'
    );
  });
});