import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeCorrelationPatterns } from '../../src/logic/it-1-br-2-1-1';

// Mock types for AI client
interface MockAiClient {
  analyzeCorrelationPatterns: jest.Mock;
}

// Test data structures
interface SalesActivity {
  employeeId: string;
  activityId: string;
  contactFrequency: number;
  proposalType: string;
  followUpInterval: number;
  patternId: string;
}

interface ConversionRecord {
  activityId: string;
  converted: boolean;
  amount?: number;
}

interface AnalysisResult {
  correlationPatterns: Array<{
    patternId: string;
    correlationCoefficient: number;
    sampleSize: number;
    conversionRate: number;
    behaviorCharacteristics: {
      contactFrequency: number;
      proposalType: string;
      followUpInterval: number;
    };
  }>;
}

interface AuditLog {
  calculationDetails: {
    datasetHash: string;
    algorithmName: string;
    patternCalculationMethods: Record<string, string>;
  };
}

interface AnalysisReport {
  reportId: string;
  generatedAt: string;
  analysisResult: AnalysisResult;
  auditLog: AuditLog;
}

describe('営業プロセス標準書との乖離分析と成約実績相関分析 - 複数パターン相関計算', () => {
  // SCEN-1217
  it('同一営業担当者の複数行動パターンすべてに対して相関分析を実行し、完全なレポートを生成する', async () => {
    // ===== SETUP: テストデータ準備 =====
    const employeeId = 'EMP-001';
    const targetMonth = '2024-01';

    // パターンA: 接触頻度：週1回（1）、提案内容：高額商品、フォローアップ間隔：3日
    const patternAActivities: SalesActivity[] = Array.from({ length: 10 }, (_, i) => ({
      employeeId,
      activityId: `ACT-A-${String(i + 1).padStart(2, '0')}`,
      contactFrequency: 1,
      proposalType: 'HIGH_VALUE',
      followUpInterval: 3,
      patternId: 'A',
    }));

    // パターンB: 接触頻度：週2回（2）、提案内容：中額商品、フォローアップ間隔：1日
    const patternBActivities: SalesActivity[] = Array.from({ length: 10 }, (_, i) => ({
      employeeId,
      activityId: `ACT-B-${String(i + 1).padStart(2, '0')}`,
      contactFrequency: 2,
      proposalType: 'MEDIUM_VALUE',
      followUpInterval: 1,
      patternId: 'B',
    }));

    // パターンC: 接触頻度：月1回（0.25）、提案内容：低額商品、フォローアップ間隔：7日
    const patternCActivities: SalesActivity[] = Array.from({ length: 10 }, (_, i) => ({
      employeeId,
      activityId: `ACT-C-${String(i + 1).padStart(2, '0')}`,
      contactFrequency: 0.25,
      proposalType: 'LOW_VALUE',
      followUpInterval: 7,
      patternId: 'C',
    }));

    const allActivities = [...patternAActivities, ...patternBActivities, ...patternCActivities];

    // パターンA成約実績: 成約率65%（6.5件 → 7件中出）
    const patternAConversions: ConversionRecord[] = [
      ...Array.from({ length: 7 }, (_, i) => ({
        activityId: `ACT-A-${String(i + 1).padStart(2, '0')}`,
        converted: true,
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        activityId: `ACT-A-${String(i + 8).padStart(2, '0')}`,
        converted: false,
      })),
    ];

    // パターンB成約実績: 成約率45%（4.5件 → 5件中出）
    const patternBConversions: ConversionRecord[] = [
      ...Array.from({ length: 5 }, (_, i) => ({
        activityId: `ACT-B-${String(i + 1).padStart(2, '0')}`,
        converted: true,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        activityId: `ACT-B-${String(i + 6).padStart(2, '0')}`,
        converted: false,
      })),
    ];

    // パターンC成約実績: 成約率25%（2.5件 → 3件中出）
    const patternCConversions: ConversionRecord[] = [
      ...Array.from({ length: 3 }, (_, i) => ({
        activityId: `ACT-C-${String(i + 1).padStart(2, '0')}`,
        converted: true,
      })),
      ...Array.from({ length: 7 }, (_, i) => ({
        activityId: `ACT-C-${String(i + 4).padStart(2, '0')}`,
        converted: false,
      })),
    ];

    const allConversions = [...patternAConversions, ...patternBConversions, ...patternCConversions];

    // ===== EXECUTION: AIエージェント呼び出し =====
    const report = await analyzeCorrelationPatterns({
      employeeId,
      targetMonth,
      activities: allActivities,
      conversions: allConversions,
      analysisTimestamp: '2024-01-31T23:59:59Z',
    });

    // ===== ASSERTIONS: 検証 =====

    // 1. レポートの基本構造
    expect(report).toHaveProperty('reportId');
    expect(report).toHaveProperty('generatedAt');
    expect(report).toHaveProperty('analysisResult');
    expect(report).toHaveProperty('auditLog');
    expect(typeof report.reportId).toBe('string');
    expect(typeof report.generatedAt).toBe('string');

    // 2. correlationPatterns配列に3つの要素がすべて含まれている
    const { analysisResult } = report as AnalysisReport;
    expect(Array.isArray(analysisResult.correlationPatterns)).toBe(true);
    expect(analysisResult.correlationPatterns.length).toBe(3);

    // 3. 各パターンの存在確認
    const patternIds = analysisResult.correlationPatterns.map((p) => p.patternId).sort();
    expect(patternIds).toEqual(['A', 'B', 'C']);

    // 4. パターンAの検証
    const patternA = analysisResult.correlationPatterns.find((p) => p.patternId === 'A');
    expect(patternA).toBeDefined();
    expect(patternA!.sampleSize).toBe(10);
    expect(patternA!.conversionRate).toBe(0.65);
    expect(patternA!.correlationCoefficient).toBeGreaterThan(0.8);
    expect(patternA!.correlationCoefficient).toBeLessThanOrEqual(0.9);
    expect(patternA!.behaviorCharacteristics.contactFrequency).toBe(1);
    expect(patternA!.behaviorCharacteristics.proposalType).toBe('HIGH_VALUE');
    expect(patternA!.behaviorCharacteristics.followUpInterval).toBe(3);

    // 5. パターンBの検証
    const patternB = analysisResult.correlationPatterns.find((p) => p.patternId === 'B');
    expect(patternB).toBeDefined();
    expect(patternB!.sampleSize).toBe(10);
    expect(patternB!.conversionRate).toBe(0.45);
    expect(patternB!.correlationCoefficient).toBeGreaterThan(0.5);
    expect(patternB!.correlationCoefficient).toBeLessThanOrEqual(0.65);
    expect(patternB!.behaviorCharacteristics.contactFrequency).toBe(2);
    expect(patternB!.behaviorCharacteristics.proposalType).toBe('MEDIUM_VALUE');
    expect(patternB!.behaviorCharacteristics.followUpInterval).toBe(1);

    // 6. パターンCの検証
    const patternC = analysisResult.correlationPatterns.find((p) => p.patternId === 'C');
    expect(patternC).toBeDefined();
    expect(patternC!.sampleSize).toBe(10);
    expect(patternC!.conversionRate).toBe(0.25);
    expect(patternC!.correlationCoefficient).toBeGreaterThan(0.25);
    expect(patternC!.correlationCoefficient).toBeLessThanOrEqual(0.4);
    expect(patternC!.behaviorCharacteristics.contactFrequency).toBe(0.25);
    expect(patternC!.behaviorCharacteristics.proposalType).toBe('LOW_VALUE');
    expect(patternC!.behaviorCharacteristics.followUpInterval).toBe(7);

    // 7. 相関係数の相対的順序検証（A > B > C）
    expect(patternA!.correlationCoefficient).toBeGreaterThan(patternB!.correlationCoefficient);
    expect(patternB!.correlationCoefficient).toBeGreaterThan(patternC!.correlationCoefficient);

    // 8. auditLogの検証
    const { auditLog } = report as AnalysisReport;
    expect(auditLog).toHaveProperty('calculationDetails');
    expect(auditLog.calculationDetails).toHaveProperty('datasetHash');
    expect(auditLog.calculationDetails).toHaveProperty('algorithmName');
    expect(auditLog.calculationDetails).toHaveProperty('patternCalculationMethods');
    expect(typeof auditLog.calculationDetails.datasetHash).toBe('string');
    expect(auditLog.calculationDetails.datasetHash.length).toBeGreaterThan(0);
    expect(typeof auditLog.calculationDetails.algorithmName).toBe('string');
    expect(
      auditLog.calculationDetails.algorithmName === 'PEARSON_CORRELATION' ||
        auditLog.calculationDetails.algorithmName === 'SPEARMAN_CORRELATION',
    ).toBe(true);

    // 9. patternCalculationMethodsにすべてのパターンが含まれている
    expect(Object.keys(auditLog.calculationDetails.patternCalculationMethods)).toEqual(
      expect.arrayContaining(['A', 'B', 'C']),
    );
    Object.values(auditLog.calculationDetails.patternCalculationMethods).forEach((method) => {
      expect(typeof method).toBe('string');
      expect(method.length).toBeGreaterThan(0);
    });

    // 10. 全相関係数が小数点第2位まで正確に計算されていることを確認
    analysisResult.correlationPatterns.forEach((pattern) => {
      const decimalPlaces = pattern.correlationCoefficient.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    // 11. 全成約率が小数点第2位まで正確に計算されている
    analysisResult.correlationPatterns.forEach((pattern) => {
      const decimalPlaces = pattern.conversionRate.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    // 12. レポートがJSON形式で出力可能であることを確認
    const reportJson = JSON.stringify(report);
    expect(typeof reportJson).toBe('string');
    expect(reportJson.length).toBeGreaterThan(0);
    const reparsedReport = JSON.parse(reportJson);
    expect(reparsedReport.reportId).toBe(report.reportId);
    expect(reparsedReport.analysisResult.correlationPatterns.length).toBe(3);
  });
});