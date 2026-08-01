import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateLearningDataQualityBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-088
  test('行動パターン分析結果が欠落している場合、学習データの品質検証に失敗する', () => {
    const incompleteAnalysisResult = {
      analysis_result_id: 'analysis_001',
      sales_staff_id: 'staff_001',
      customer_contact_frequency: undefined,
      sales_progress_transition_pattern: undefined,
      lost_deal_factor_classification: undefined,
      created_at: new Date('2024-01-15T11:00:00Z'),
      updated_at: new Date('2024-01-15T11:00:00Z'),
    };

    const validationResult = validateLearningDataQualityBeforeInference([
      incompleteAnalysisResult,
    ]);

    expect(validationResult.status).toBe(false);
    expect(validationResult.error).toBeDefined();
    expect(validationResult.error?.code).toBe('DATA_QUALITY_VALIDATION_FAILED');
    expect(validationResult.error?.message).toMatch(/顧客接触頻度/);
    expect(validationResult.error?.message).toMatch(/商談進捗遷移パターン/);
    expect(validationResult.error?.message).toMatch(/失注要因分類/);
    expect(validationResult.inference_allowed).toBe(false);
  });
});