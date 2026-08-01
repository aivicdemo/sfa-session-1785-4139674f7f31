import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateImportanceScore } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-569
  test('問題要因が0件の場合、重要度スコア計算はエラーレスポンスを返す', async () => {
    const caseId = 'CASE-2024-001';
    const problemFactors: any[] = [];

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 400,
        errorCode: 'INVALID_PROBLEM_COUNT',
        message: '問題要因が0件のため重要度スコアを計算できません',
        score: null,
      }),
      { status: 400 }
    );

    try {
      await calculateImportanceScore(caseId, problemFactors);
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toMatch(/問題要因/);
      expect(error.status).toBe(400);
      expect(error.errorCode).toBe('INVALID_PROBLEM_COUNT');
      expect(error.score).toBeNull();
    }
  });
});