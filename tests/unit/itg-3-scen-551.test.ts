import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { executeGuidanceDecision } from '../../src/logic/it-1-br-3-1-1-1';

describe('営業指導方針決定機能 - 検証結果レポート欠落時のエラーハンドリング', () => {
  let aiRecommendationEngineStub: any;
  let fileStorageAdapterStub: any;

  beforeEach(() => {
    aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach_id: 'APP-001',
        customer_name: 'テスト顧客A',
        recommended_action: '経営層向けプレゼンテーション実施',
        confidence_score: 85,
        success_patterns: [
          {
            pattern_id: 'PAT-001',
            pattern_name: '中堅企業への経営効率化提案',
            match_score: 0.92
          }
        ],
        reasoning: '同規模企業での類似成功事例が複数存在し、提案内容が顧客課題と高度に適合'
      })
    };

    fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue(null),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-551
  it('検証結果レポートメタデータが欠落しているとき、方針決定は失敗ステータスを返し、エラーメッセージと不完全な状態を記録する', async () => {
    const salesCaseData = {
      case_id: 'CASE-2024-0551',
      customer_name: 'テスト顧客A',
      transaction_amount: 5000000,
      industry: '製造業',
      company_scale: '中堅企業',
      business_challenge: '生産効率の向上とコスト削減',
      sales_stage: '初期接触後',
      decision_date: new Date('2024-02-15T10:30:00Z')
    };

    const result = await executeGuidanceDecision(
      salesCaseData,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    expect(result.status).toBe('FAILED');
    expect(result.error_message).toBe('検証結果レポートの生成に失敗したため、方針決定を中断しました');
    expect(result.decision_state).toBe('INCOMPLETE');
    expect(result.guidance_policy).toBeUndefined();
    expect(result.internal_log).toContain('ReportMetadataException: Verification report metadata is missing');
  });
});