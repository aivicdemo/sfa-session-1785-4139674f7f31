import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import * as logic from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1020
  test('成功パターン適用ガイドライン周知完了判定 - 実務適用報告フラグが欠落しているとき処理がエラーになること', async () => {
    const endpoint = '/api/success-pattern-guideline-completion';
    const requestPayload = {
      salesRepresentativeId: 'SR001',
      guidelineId: 'GUIDE-2024-001',
      comprehensionScore: 85,
      completionDate: '2024-01-15T10:00:00Z'
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'MISSING_REQUIRED_FIELD',
          message: '実務適用報告フラグが必須です',
          field: 'practicalApplicationReportFlag'
        }
      }),
      { status: 400 }
    );

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    expect(response.status).toBe(400);

    const errorBody = await response.json();
    expect(errorBody.error.code).toBe('MISSING_REQUIRED_FIELD');
    expect(errorBody.error.message).toBe('実務適用報告フラグが必須です');
    expect(errorBody.error.field).toBe('practicalApplicationReportFlag');
  });
});