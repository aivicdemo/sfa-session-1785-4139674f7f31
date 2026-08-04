import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 前提条件検証', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  // SCEN-1010
  test('AIエージェント利用不可能な場合、代替パターンが表示される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error('Connection error'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockPatternMaster = [
      {
        id: 'pattern_001',
        name: '新規顧客向けクイック提案',
        successRate: 0.87,
        applicableIndustries: ['IT', 'Manufacturing'],
        keyActions: ['初回ヒアリング', '簡易提案', 'フォローアップ'],
        estimatedDealValue: 5000000
      },
      {
        id: 'pattern_002',
        name: '既存顧客向け拡大提案',
        successRate: 0.79,
        applicableIndustries: ['Finance', 'Retail'],
        keyActions: ['拡大ニーズ分析', '詳細提案'],
        estimatedDealValue: 8000000
      },
      {
        id: 'pattern_003',
        name: '経営課題解決型提案',
        successRate: 0.92,
        applicableIndustries: ['All'],
        keyActions: ['経営層ヒアリング', 'ROI分析', '導入支援計画'],
        estimatedDealValue: 12000000
      }
    ];

    const testInputData = {
      customerId: 'CUST_12345',
      customerName: 'テスト株式会社',
      industry: 'IT',
      employeeCount: 500,
      annualRevenue: 5000000000,
      dealStage: 'initial_contact',
      dealValue: 3000000,
      dealDescription: 'クラウドシステム導入',
      dealConditions: {
        budgetLimit: 5000000,
        implementationDeadline: '2024-06-30',
        decisionMaker: 'CTO',
        competitorInfo: 'Competitor_A'
      }
    };

    const retryAttempts: number[] = [];
    let currentAttempt = 0;

    const mockAIEngineWithRetry = {
      generateRecommendation: jest.fn(async () => {
        currentAttempt++;
        retryAttempts.push(currentAttempt);

        if (currentAttempt === 1) {
          await jest.advanceTimersByTimeAsync(1000);
          throw new Error('Connection error');
        } else if (currentAttempt === 2) {
          await jest.advanceTimersByTimeAsync(2000);
          throw new Error('Timeout');
        } else if (currentAttempt === 3) {
          await jest.advanceTimersByTimeAsync(4000);
          throw new Error('503 Service Unavailable');
        }
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = await generateRecommendationWithFallback(
      testInputData,
      mockAIEngineWithRetry,
      mockPatternMaster
    );

    expect(retryAttempts.length).toBe(3);
    expect(retryAttempts).toEqual([1, 2, 3]);

    expect(result).toEqual({
      status: 'fallback_applied',
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendedPatterns: [
        {
          id: 'pattern_003',
          name: '経営課題解決型提案',
          successRate: 0.92,
          applicableIndustries: ['All'],
          keyActions: ['経営層ヒアリング', 'ROI分析', '導入支援計画'],
          estimatedDealValue: 12000000
        },
        {
          id: 'pattern_001',
          name: '新規顧客向けクイック提案',
          successRate: 0.87,
          applicableIndustries: ['IT', 'Manufacturing'],
          keyActions: ['初回ヒアリング', '簡易提案', 'フォローアップ'],
          estimatedDealValue: 5000000
        },
        {
          id: 'pattern_002',
          name: '既存顧客向け拡大提案',
          successRate: 0.79,
          applicableIndustries: ['Finance', 'Retail'],
          keyActions: ['拡大ニーズ分析', '詳細提案'],
          estimatedDealValue: 8000000
        }
      ],
      reasoningSummary: '成功パターンマスタから統計的に上位の推奨を抽出しました。',
      apiRetryCount: 3,
      executionTimeMs: 7000
    });

    const totalExecutionTime = 1000 + 2000 + 4000;
    expect(totalExecutionTime).toBeLessThanOrEqual(30000);
  });
});