import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/logic/it-1-br-2-1-1';

// Mock types for Tx12Imp1AiClient
interface Tx12Imp1AiClientMock {
  analyzeCorrelation: jest.Mock;
  generateReport: jest.Mock;
}

// Test data types
interface SalesPerformanceData {
  id: string;
  salesPersonId: string;
  date: string;
  amount: number;
  productCategory: string;
}

interface SalesActionPattern {
  salesPersonId: string;
  contactFrequency: number;
  proposalContent: string;
  followUpIntervalDays: number;
}

interface CorrelationAnalysisResult {
  correlationCoefficient: number;
  confidenceScore: number;
  successPatternCharacteristics: {
    contactFrequency: number;
    proposalContent: string;
    followUpIntervalDays: number;
  };
  datasetReference: {
    salesPerformanceCount: number;
    actionPatternDataUsed: string[];
  };
  calculationLogic: {
    correlationCoefficientMethod: string;
    sampleSizeAdjustmentMethod: string;
  };
  auditLog: {
    timestamp: string;
    datasetUsed: string[];
    computationDetails: string;
  };
}

describe('営業データ分析から乖離検出までの自律実行 (Tx12Imp1Agent)', () => {
  // SCEN-1171
  test('成約実績との相関分析機能 - 成約実績が1件の場合、相関分析結果が正常に計算される', async () => {
    // テスト用の成約実績データセット初期化：成約実績が1件のみ
    const salesPerformanceDataset: SalesPerformanceData[] = [
      {
        id: 'perf_001',
        salesPersonId: 'salesperson_a',
        date: '2024-01-15',
        amount: 1000000,
        productCategory: 'システム導入',
      },
    ];

    // テスト用の営業行動パターンデータ初期化
    const salesActionPatternDataset: SalesActionPattern[] = [
      {
        salesPersonId: 'salesperson_a',
        contactFrequency: 5,
        proposalContent: 'システム導入',
        followUpIntervalDays: 7,
      },
    ];

    // Tx12Imp1AiClientのモック（スタブ）を注入
    const mockAiClient: Tx12Imp1AiClientMock = {
      analyzeCorrelation: jest.fn().mockResolvedValue({
        correlationCoefficient: 0.85,
        confidenceScoreRaw: 0.15,
        successPatternCharacteristics: {
          contactFrequency: 5,
          proposalContent: 'システム導入',
          followUpIntervalDays: 7,
        },
        datasetReference: {
          salesPerformanceCount: 1,
          actionPatternDataUsed: ['salesperson_a'],
        },
        calculationLogic: {
          correlationCoefficientMethod: 'ピアソン相関係数',
          sampleSizeAdjustmentMethod: 'サンプルサイズ1による信頼度補正（0.15 = 1/N）',
        },
      }),
      generateReport: jest.fn().mockResolvedValue({
        status: 'generated',
        reportId: 'report_20240115_001',
      }),
    };

    // runTx12Imp1Agent関数を呼び出し、成約実績1件に対する相関分析処理を実行
    const analysisResult: CorrelationAnalysisResult = await runTx12Imp1Agent(
      {
        salesPerformanceDataset,
        salesActionPatternDataset,
        analysisMonth: '2024-01',
        targetSalesPersonId: 'salesperson_a',
      },
      mockAiClient as any
    );

    // 分析処理が完了し、相関分析結果オブジェクトが返却されることを確認
    expect(analysisResult).toBeDefined();
    expect(analysisResult).toHaveProperty('correlationCoefficient');
    expect(analysisResult).toHaveProperty('confidenceScore');
    expect(analysisResult).toHaveProperty('successPatternCharacteristics');

    // 返却された相関分析結果から、相関係数を検証
    // 相関係数が計算可能な値（-1.0～1.0の範囲内）として記録されていることを検証
    expect(analysisResult.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(analysisResult.correlationCoefficient).toBeLessThanOrEqual(1.0);
    expect(analysisResult.correlationCoefficient).toBe(0.85);

    // 信頼度スコアが成約実績1件の条件を反映し、
    // 0.0～1.0の範囲内で適切に低減された値となっていることを確認
    // サンプルサイズ1のため信頼度は低い（0.15）
    expect(analysisResult.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(analysisResult.confidenceScore).toBeLessThanOrEqual(1.0);
    expect(analysisResult.confidenceScore).toBe(0.15);
    expect(analysisResult.confidenceScore).toBeLessThan(0.3);

    // 成功パターンの特性として「接触頻度5回」「提案内容：システム導入」
    // 「フォローアップ間隔7日」が正確に抽出・記録されていることを確認
    expect(analysisResult.successPatternCharacteristics.contactFrequency).toBe(5);
    expect(analysisResult.successPatternCharacteristics.proposalContent).toBe('システム導入');
    expect(analysisResult.successPatternCharacteristics.followUpIntervalDays).toBe(7);

    // 分析結果の根拠データセットとして、使用した成約実績データと
    // 営業行動パターンデータへの参照が監査ログに記録されていることを検証
    expect(analysisResult.datasetReference).toBeDefined();
    expect(analysisResult.datasetReference.salesPerformanceCount).toBe(1);
    expect(analysisResult.datasetReference.actionPatternDataUsed).toContain('salesperson_a');

    // 監査ログにデータセットと計算ロジックが記録されていることを確認
    expect(analysisResult.auditLog).toBeDefined();
    expect(analysisResult.auditLog.datasetUsed).toContain('sales_performance_1_records');
    expect(analysisResult.auditLog.computationDetails).toContain('ピアソン相関係数');
    expect(analysisResult.auditLog.computationDetails).toContain('サンプルサイズ1による信頼度補正');

    // 分析結果の計算ロジック（相関係数の算出方式、サンプルサイズ補正ロジック）
    // がレポート内に明記されていることを確認
    expect(analysisResult.calculationLogic).toBeDefined();
    expect(analysisResult.calculationLogic.correlationCoefficientMethod).toBe('ピアソン相関係数');
    expect(analysisResult.calculationLogic.sampleSizeAdjustmentMethod).toMatch(/サンプルサイズ1/);
    expect(analysisResult.calculationLogic.sampleSizeAdjustmentMethod).toMatch(/信頼度補正/);

    // AIエージェントのモック呼び出しが期待通り実行されたことを確認
    expect(mockAiClient.analyzeCorrelation).toHaveBeenCalledWith(
      expect.objectContaining({
        salesPerformanceCount: 1,
        targetSalesPersonId: 'salesperson_a',
      })
    );
  });
});