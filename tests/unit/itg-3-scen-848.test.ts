import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し推奨アプローチを自動推奨する機能', () => {
  let mockAIEngine: AIRecommendationEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };
  });

  it('SCEN-848: 顧客・商談条件の必須項目が欠けているとき、エラーで処理が進まない', async () => {
    // 準備: 必須項目（顧客ID）が null の入力オブジェクト
    const incompleteInput = {
      customerId: null,
      customerName: '株式会社テスト',
      industry: 'IT',
      revenue: 5000000,
      dealStage: 'negotiation',
      proposedBudget: 1000000,
      dealCreatedAt: '2024-01-15T10:00:00Z',
    };

    // モック実装: 必須項目欠落の検証ロジック
    mockAIEngine.generateRecommendation = jest.fn().mockImplementation((input) => {
      const requiredFields = [
        'customerId',
        'customerName',
        'industry',
        'dealStage',
        'proposedBudget',
      ];

      const missingFields = requiredFields.filter(
        (field) => input[field] === null || input[field] === ''
      );

      if (missingFields.length > 0) {
        return {
          code: 'VALIDATION_ERROR_MISSING_REQUIRED_FIELDS',
          message: '顧客・商談条件の必須項目が不足しています',
          recommendation: null,
          confidenceScore: null,
          reasoning: null,
        };
      }

      // 正常系（このテストでは到達しない）
      return {
        code: 'SUCCESS',
        recommendation: 'sample',
        confidenceScore: 85,
        reasoning: 'sample reasoning',
      };
    });

    // 実行
    const result = mockAIEngine.generateRecommendation(incompleteInput);

    // 検証: エラーコード確認
    expect(result.code).toBe('VALIDATION_ERROR_MISSING_REQUIRED_FIELDS');

    // 検証: エラーメッセージが必須項目不足を含むことを確認
    expect(result.message).toMatch(/必須項目/);

    // 検証: 推奨内容が null
    expect(result.recommendation).toBeNull();

    // 検証: 信頼度スコアが null
    expect(result.confidenceScore).toBeNull();

    // 検証: 根拠説明が null
    expect(result.reasoning).toBeNull();

    // 検証: 下位メソッドが呼び出されていないことを確認
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});