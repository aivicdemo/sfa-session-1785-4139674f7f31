import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-145: 商談記録の日付情報が欠落しているとき、エラーが発生する', () => {
    // テスト用の商談記録データセット（日付情報がnull）
    const dealRecordsWithMissingDate = [
      {
        dealId: 'DEAL-001',
        salesPersonId: 'SP-001',
        dealName: '顧客A 商談1',
        amount: 500000,
        dealDate: null, // 日付情報が欠落
        status: 'closed'
      },
      {
        dealId: 'DEAL-002',
        salesPersonId: 'SP-001',
        dealName: '顧客B 商談2',
        amount: 300000,
        dealDate: undefined, // 日付情報が未定義
        status: 'closed'
      }
    ];

    // 行動パターン分析レポート生成関数を実行
    const result = generateSalesActivityPatternReport(dealRecordsWithMissingDate);

    // エラーが返却されることを検証
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('ERR_MISSING_DEAL_DATE');
    expect(result.error.message).toMatch(/商談記録の日付情報が不足しています/);
    expect(result.reportData).toBeUndefined();
  });
});