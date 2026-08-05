import { describe, test, expect } from '@jest/globals';
import { analyzeCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-677
  test('顧客IDが空文字列のとき顧客対応パターンマッチングに失敗しエラーになる', () => {
    const salesRepId = 'REP-001';
    const customerId = '';
    const responseDate = new Date('2024-01-15T10:00:00Z');
    const responseType = 'email_reply';
    const responseScore = 0.85;

    expect(() =>
      analyzeCustomerResponsePattern({
        salesRepId,
        customerId,
        responseDate,
        responseType,
        responseScore,
      })
    ).toThrow(/顧客ID/);
  });
});