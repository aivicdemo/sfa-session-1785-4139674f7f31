import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨エンジン - タイムアウト時のフォールバック機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  test('SCEN-1429: AIエンジンが30秒タイムアウトしたとき、キャッシュされた過去推奨が統計的上位1件で代替表示される', async () => {
    const inputCaseInfo = {
      caseId: 'CASE-NEW-2024-001',
      customerName: 'ABC Manufacturing Inc.',
      industry: 'manufacturing',
      budgetRange: 'large',
      dealStage: 'qualification',
    };

    const mockCachedPatterns = [
      {
        patternId: 'PAT-001',
        industry: 'manufacturing',
        proposalApproach: 'Cost Optimization Strategy',
        successRate: 0.92,
        reasoning: 'フロー最適化で15%コスト削減',
        isAbbreviated: true,
      },
      {
        patternId: 'PAT-002',
        industry: 'manufacturing',
        proposalApproach: 'Supply Chain Integration',
        successRate: 0.78,
        reasoning: 'サプライチェーン統合で納期短縮',
        isAbbreviated: true,
      },
      {
        patternId: 'PAT-003',
        industry: 'manufacturing',
        proposalApproach: 'Quality Enhancement Program',
        successRate: 0.85,
        reasoning: '品質管理体系の強化',
        isAbbreviated: true,
      },
    ];

    let callAttempts = 0;
    const maxRetries = 3;

    fetchMock.mockImplementation(async () => {
      callAttempts++;
      if (callAttempts <= maxRetries) {
        const delay = Math.pow(2, callAttempts - 1) * 1000;
        await new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Timeout (30s): AI API unreachable')),
            Math.min(delay, 30000)
          )
        );
      }
      throw new Error('Max retries exceeded');
    });

    const result = await generateRecommendationWithFallback(inputCaseInfo, {
      timeoutMs: 30000,
      maxRetries: 3,
      retryDelayMs: 1000,
      cachedPatterns: mockCachedPatterns,
    });

    expect(result.status).toBe('fallback');
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.recommendation).toEqual({
      patternId: 'PAT-001',
      industry: 'manufacturing',
      proposalApproach: 'Cost Optimization Strategy',
      successRate: 0.92,
      reasoning: 'フロー最適化で15%コスト削減',
      isAbbreviated: true,
    });
    expect(result.recommendation.successRate).toBe(0.92);
    expect(result.recommendation.isAbbreviated).toBe(true);
    expect(result.retryAttempts).toBe(3);
    expect(callAttempts).toBe(3);
  });
});