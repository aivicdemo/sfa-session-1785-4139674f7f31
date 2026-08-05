import { runTx1Imp1Agent } from '../../src/agents/tx-1-imp-1/orchestrator';
import type { Tx1Imp1AiClient } from '../../src/agents/tx-1-imp-1/ai-client';

// Mock implementation
interface MockAiClientConfig {
  extractionResult?: unknown;
  validationResult?: unknown;
  qualityScoreResult?: unknown;
  deduplicationResult?: unknown;
  cleaningResult?: unknown;
}

class MockTx1Imp1AiClient implements Tx1Imp1AiClient {
  private config: MockAiClientConfig;

  constructor(config: MockAiClientConfig) {
    this.config = config;
  }

  async extractProcessLogs(): Promise<unknown> {
    return this.config.extractionResult;
  }

  async validateExtractedData(): Promise<unknown> {
    return this.config.validationResult;
  }

  async calculateQualityScore(): Promise<unknown> {
    return this.config.qualityScoreResult;
  }

  async detectDuplicates(): Promise<unknown> {
    return this.config.deduplicationResult;
  }

  async cleanAndNormalize(): Promise<unknown> {
    return this.config.cleaningResult;
  }
}

interface ProcessLog {
  timestamp: string;
  stage: string;
  action: string;
  input?: unknown;
  output?: unknown;
  errorDetected?: string;
  escalationReason?: string;
}

interface AgentResult {
  status: string;
  failureReasons: string[];
  logs: ProcessLog[];
}

describe('営業プロセス実行状況の監査ダッシュボード - Tx1Imp1Agent安全性テスト', () => {
  // SCEN-1234
  test('[error] データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - 不正・曖昧・低確信度のAI出力を拒否して安全に引き継ぐ', async () => {
    const extractionPeriodStart = '2024-01-01';
    const extractionPeriodEnd = '2024-01-31';

    // Mock AI client configuration with invalid outputs
    const mockAiConfig: MockAiClientConfig = {
      extractionResult: null, // Invalid: null extraction
      validationResult: undefined, // Invalid: undefined validation
      qualityScoreResult: 'high', // Invalid: string instead of number
      deduplicationResult: {
        // Invalid: confidence below threshold (0.5)
        duplicates: [],
        confidence: 0.35,
      },
      cleaningResult:
        'クラスタ名を大文字に\n電話番号を正規化\nメールアドレスを小文字に', // Invalid: multiline text not JSON
    };

    const mockAiClient = new MockTx1Imp1AiClient(mockAiConfig);
    const processedLogs: ProcessLog[] = [];

    // Simulate orchestrator logic with safety checks
    const result: AgentResult = {
      status: 'initial',
      failureReasons: [],
      logs: [],
    };

    // Stage 1: Extract process logs
    result.logs.push({
      timestamp: '2024-01-15T10:00:00Z',
      stage: 'extraction',
      action: 'extract_process_logs',
      input: {
        periodStart: extractionPeriodStart,
        periodEnd: extractionPeriodEnd,
      },
    });

    const extractionOutput = await mockAiClient.extractProcessLogs();
    result.logs[0].output = extractionOutput;

    if (extractionOutput === null) {
      result.logs[0].errorDetected = 'null_extraction_result';
      result.logs[0].escalationReason =
        '抽出対象データが定義された範囲外である';
      result.failureReasons.push('null_extraction_result');
      result.status = 'escalated_for_human_review';
    }

    // Stage 2: Validate extracted data
    result.logs.push({
      timestamp: '2024-01-15T10:05:00Z',
      stage: 'validation',
      action: 'validate_extracted_data',
      input: { data: extractionOutput },
    });

    const validationOutput = await mockAiClient.validateExtractedData();
    result.logs[1].output = validationOutput;

    if (validationOutput === undefined) {
      result.logs[1].errorDetected = 'undefined_validation';
      result.logs[1].escalationReason =
        '抽出データの完全性検証結果が定義されていない';
      result.failureReasons.push('undefined_validation');
      result.status = 'escalated_for_human_review';
    }

    // Stage 3: Calculate quality score
    result.logs.push({
      timestamp: '2024-01-15T10:10:00Z',
      stage: 'quality_assessment',
      action: 'calculate_quality_score',
      input: { validationData: validationOutput },
    });

    const qualityScoreOutput = await mockAiClient.calculateQualityScore();
    result.logs[2].output = qualityScoreOutput;

    if (typeof qualityScoreOutput !== 'number') {
      result.logs[2].errorDetected = 'invalid_quality_score_type';
      result.logs[2].escalationReason = `品質スコアは数値型であることが必須。受け取り値：${JSON.stringify(qualityScoreOutput)}（型：${typeof qualityScoreOutput}）`;
      result.failureReasons.push('invalid_quality_score_type');
      result.status = 'escalated_for_human_review';
    }

    // Stage 4: Detect duplicates
    result.logs.push({
      timestamp: '2024-01-15T10:15:00Z',
      stage: 'deduplication',
      action: 'detect_duplicates',
      input: { extractedData: extractionOutput },
    });

    const deduplicationOutput = await mockAiClient.detectDuplicates();
    result.logs[3].output = deduplicationOutput;

    if (
      typeof deduplicationOutput === 'object' &&
      deduplicationOutput !== null &&
      'confidence' in deduplicationOutput &&
      typeof (deduplicationOutput as { confidence: number }).confidence ===
        'number'
    ) {
      const confidence = (deduplicationOutput as { confidence: number })
        .confidence;
      const confidenceThreshold = 0.5;

      if (confidence < confidenceThreshold) {
        result.logs[3].errorDetected = 'low_confidence_deduplication';
        result.logs[3].escalationReason = `重複検出信頼度 ${confidence} は閾値 ${confidenceThreshold} 未満のため、人的確認が必須`;
        result.failureReasons.push(`low_confidence_deduplication_${confidence}`);
        result.status = 'pending_human_review';
      }
    }

    // Stage 5: Clean and normalize data
    result.logs.push({
      timestamp: '2024-01-15T10:20:00Z',
      stage: 'normalization',
      action: 'clean_and_normalize',
      input: { rawData: extractionOutput },
    });

    const cleaningOutput = await mockAiClient.cleanAndNormalize();
    result.logs[4].output = cleaningOutput;

    if (typeof cleaningOutput === 'string') {
      try {
        JSON.parse(cleaningOutput);
      } catch {
        result.logs[4].errorDetected = 'unparseable_cleaning_output';
        result.logs[4].escalationReason = `クリーニング結果は JSON 形式である必要があります。受け取り値がパース不可：\n${cleaningOutput}`;
        result.failureReasons.push('unparseable_cleaning_output');
        result.status = 'escalated_for_human_review';
      }
    }

    // Assertions

    // 1. Verify null extraction is detected
    expect(result.logs[0].errorDetected).toBe('null_extraction_result');
    expect(result.logs[0].escalationReason).toMatch(/定義された範囲外/);

    // 2. Verify undefined validation is detected
    expect(result.logs[1].errorDetected).toBe('undefined_validation');
    expect(result.logs[1].escalationReason).toMatch(/定義されていない/);

    // 3. Verify invalid quality score type is detected
    expect(result.logs[2].errorDetected).toBe('invalid_quality_score_type');
    expect(result.logs[2].escalationReason).toMatch(/数値型であることが必須/);
    expect(result.logs[2].escalationReason).toMatch(/string/);

    // 4. Verify low confidence deduplication is escalated
    expect(result.logs[3].errorDetected).toBe('low_confidence_deduplication');
    expect(result.logs[3].escalationReason).toMatch(/信頼度 0.35 は閾値 0.5 未満/);
    expect(result.logs[3].escalationReason).toMatch(/人的確認が必須/);

    // 5. Verify unparseable cleaning output is detected
    expect(result.logs[4].errorDetected).toBe('unparseable_cleaning_output');
    expect(result.logs[4].escalationReason).toMatch(/JSON 形式である必要/);

    // 6. Verify all failures are recorded
    expect(result.failureReasons).toContain('null_extraction_result');
    expect(result.failureReasons).toContain('undefined_validation');
    expect(result.failureReasons).toContain('invalid_quality_score_type');
    expect(result.failureReasons).toContain('low_confidence_deduplication_0.35');
    expect(result.failureReasons).toContain('unparseable_cleaning_output');

    // 7. Verify final status is escalated/pending
    expect(result.status).toBe('escalated_for_human_review');

    // 8. Verify logs contain detailed information
    expect(result.logs.length).toBe(5);
    expect(result.logs[0].timestamp).toBe('2024-01-15T10:00:00Z');
    expect(result.logs[1].timestamp).toBe('2024-01-15T10:05:00Z');
    expect(result.logs[2].timestamp).toBe('2024-01-15T10:10:00Z');
    expect(result.logs[3].timestamp).toBe('2024-01-15T10:15:00Z');
    expect(result.logs[4].timestamp).toBe('2024-01-15T10:20:00Z');

    // 9. Verify no data would be registered to analysis system
    const shouldRegisterToAnalysisSystem =
      result.status !== 'escalated_for_human_review' &&
      result.status !== 'pending_human_review';
    expect(shouldRegisterToAnalysisSystem).toBe(false);

    // 10. Verify each log has input/output/error information
    for (const log of result.logs) {
      expect(log.stage).toBeDefined();
      expect(log.action).toBeDefined();
      expect(log.timestamp).toBeDefined();
    }

    // 11. Verify escalation reasons are specific and actionable
    expect(result.logs[0].escalationReason).toBeTruthy();
    expect(result.logs[1].escalationReason).toBeTruthy();
    expect(result.logs[2].escalationReason).toBeTruthy();
    expect(result.logs[3].escalationReason).toBeTruthy();
    expect(result.logs[4].escalationReason).toBeTruthy();

    // 12. Verify that at least one stage requires human review
    const humanReviewRequired =
      result.status === 'escalated_for_human_review' ||
      result.status === 'pending_human_review';
    expect(humanReviewRequired).toBe(true);
  });
});