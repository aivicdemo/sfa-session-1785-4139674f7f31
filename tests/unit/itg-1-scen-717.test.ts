import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProposalAndCustomerInteractionPatterns } from '../../src/logic/it-1-br-2-1-1';

// Mock types and constants
interface CustomerInteractionRecord {
  recordId: string;
  customerId: string;
  proposalCategory: string;
  proposalAmount: number;
  proposalDateTime: string;
  standardProcessSteps: string[];
}

interface AnalysisResult {
  recordId: string;
  matchScore: number;
  deviationPoints: string[];
}

interface AnalysisReport {
  totalRecordsAnalyzed: number;
  totalRecordsStored: number;
  executionTimeMs: number;
  averageMatchScore: number;
  totalMatchScore: number;
  deviationDistribution: { [key: string]: number };
  errorCount: number;
}

// Helper to generate large test dataset
function generateCustomerInteractionRecords(count: number): CustomerInteractionRecord[] {
  const records: CustomerInteractionRecord[] = [];
  const categories = ['A', 'B', 'C'];
  const steps = ['初期接触', 'ニーズ把握', '提案', 'クローズ'];
  
  for (let i = 0; i < count; i++) {
    records.push({
      recordId: `REC-${String(i + 1).padStart(6, '0')}`,
      customerId: `CUST-${String((i % 1000) + 1).padStart(4, '0')}`,
      proposalCategory: categories[i % categories.length],
      proposalAmount: 100000 + (i % 500000),
      proposalDateTime: new Date(2024, 0, 1 + (i % 28), 9 + (i % 8), 0, 0).toISOString(),
      standardProcessSteps: steps,
    });
  }
  
  return records;
}

// Mock external standard process comparison service
function mockStandardProcessComparisonService(
  recordId: string,
  _proposalCategory: string,
  _proposalAmount: number,
  _proposalDateTime: string,
  _standardProcessSteps: string[]
): AnalysisResult {
  const hash = recordId.charCodeAt(recordId.length - 1);
  const matchScore = (hash % 101); // 0-100
  const deviationSteps = [
    '初期接触',
    'ニーズ把握',
    '提案',
    'クローズ',
  ];
  const deviationCount = (hash % 4) + 1;
  const deviations: string[] = [];
  
  for (let i = 0; i < deviationCount; i++) {
    deviations.push(deviationSteps[(hash + i) % deviationSteps.length]);
  }
  
  return {
    recordId,
    matchScore,
    deviationPoints: deviations,
  };
}

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-717
  test('提案内容と顧客対応パターンの標準プロセス比較分析 - 50000件規模データの処理完了', async () => {
    // Setup: 業務上の最大規模件数である顧客対応記録50,000件を準備
    const maxRecordCount = 50000;
    const customerRecords = generateCustomerInteractionRecords(maxRecordCount);
    
    // Setup: 処理開始時刻を記録
    const processStartTime = new Date('2024-01-15T11:00:00Z').getTime();
    const mockStartTimestamp = processStartTime;
    
    // Execute: 分析処理の実行
    // 各顧客対応記録に対して標準プロセス比較サービスをコール
    const analysisResults: AnalysisResult[] = [];
    const deviationMap: { [key: string]: number } = {
      '初期接触': 0,
      'ニーズ把握': 0,
      '提案': 0,
      'クローズ': 0,
    };
    let totalMatchScore = 0;
    let errorCount = 0;
    
    for (const record of customerRecords) {
      try {
        const result = mockStandardProcessComparisonService(
          record.recordId,
          record.proposalCategory,
          record.proposalAmount,
          record.proposalDateTime,
          record.standardProcessSteps
        );
        
        analysisResults.push(result);
        totalMatchScore += result.matchScore;
        
        for (const deviation of result.deviationPoints) {
          if (deviation in deviationMap) {
            deviationMap[deviation]++;
          }
        }
      } catch {
        errorCount++;
      }
    }
    
    // Setup: 処理完了時刻を記録
    const mockEndTimestamp = mockStartTimestamp + 45000; // 45秒
    const executionTimeMs = mockEndTimestamp - mockStartTimestamp;
    
    // Calculate report metrics
    const report: AnalysisReport = {
      totalRecordsAnalyzed: customerRecords.length,
      totalRecordsStored: analysisResults.length,
      executionTimeMs,
      averageMatchScore: Math.round(totalMatchScore / analysisResults.length),
      totalMatchScore,
      deviationDistribution: deviationMap,
      errorCount,
    };
    
    // Call the actual logic function
    const result = await analyzeProposalAndCustomerInteractionPatterns({
      records: customerRecords,
      mockComparisonService: mockStandardProcessComparisonService,
    });
    
    // Assertions: 期待結果の検証
    
    // 50,000件すべての顧客対応記録について分析が完了し、
    // 分析結果レコード50,000件がデータベースに正常に格納されることを検証
    expect(result.totalRecordsAnalyzed).toBe(50000);
    expect(result.totalRecordsStored).toBe(50000);
    
    // 処理実行時間が60秒以内であることを検証
    expect(result.executionTimeMs).toBeLessThanOrEqual(60000);
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
    
    // 合致度スコアが0～100の範囲内で全件に割り当てられていることを検証
    expect(result.analysisResults).toHaveLength(50000);
    for (const analysisItem of result.analysisResults) {
      expect(analysisItem.matchScore).toBeGreaterThanOrEqual(0);
      expect(analysisItem.matchScore).toBeLessThanOrEqual(100);
    }
    
    // 逸脱箇所リストが各レコードに正常に格納されていることを検証
    for (const analysisItem of result.analysisResults) {
      expect(Array.isArray(analysisItem.deviationPoints)).toBe(true);
      expect(analysisItem.deviationPoints.length).toBeGreaterThanOrEqual(0);
    }
    
    // 逸脱箇所の分布（どのプロセスステップで逸脱が最も多いか）を確認
    expect(result.deviationDistribution).toBeDefined();
    expect(typeof result.deviationDistribution['初期接触']).toBe('number');
    expect(typeof result.deviationDistribution['ニーズ把握']).toBe('number');
    expect(typeof result.deviationDistribution['提案']).toBe('number');
    expect(typeof result.deviationDistribution['クローズ']).toBe('number');
    
    const maxDeviation = Math.max(
      ...Object.values(result.deviationDistribution)
    );
    expect(maxDeviation).toBeGreaterThanOrEqual(0);
    
    // エラーログが出力されていないことを確認
    expect(result.errorCount).toBe(0);
    
    // 平均合致度スコアが計算されていることを確認
    expect(result.averageMatchScore).toBeGreaterThanOrEqual(0);
    expect(result.averageMatchScore).toBeLessThanOrEqual(100);
    
    // 合計合致度スコアが正の値であることを確認
    expect(result.totalMatchScore).toBeGreaterThanOrEqual(0);
  });
});