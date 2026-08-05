import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordSuccessPatternJudgmentRationale } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockSystemLog: { timestamp: string; missingFields: string[] }[] = [];

  beforeEach(() => {
    mockSystemLog = [];
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-402
  test('成功パターンマトリクス適用判定機能 - 判断根拠の記録に必要なメタデータが欠落しているとき記録処理が中断される', () => {
    const validJudgmentResult = {
      successPatternMatrixCode: 'SPM-001',
      matrixSelectionReason: '顧客規模と提案内容が過去成功事例と合致',
      evaluationScore: 0.92,
    };

    const metadataWithMissingFields = {
      salesStageId: 'SS-002',
      judgmentCriteriaCode: null,
      evaluatorUserId: undefined,
      timestamp: '2024-01-15T14:30:00Z',
      systemLog: mockSystemLog,
    };

    expect(() => {
      recordSuccessPatternJudgmentRationale(
        validJudgmentResult,
        metadataWithMissingFields
      );
    }).toThrow(/MetadataValidationError|ERR_METADATA_MISSING/);

    expect(mockSystemLog.length).toBeGreaterThan(0);
    const logEntry = mockSystemLog[mockSystemLog.length - 1];
    expect(logEntry.missingFields).toContain('judgmentCriteriaCode');
    expect(logEntry.missingFields).toContain('evaluatorUserId');
  });
});