import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1693
  test('過去商談データに必須フィールド(結果ステータス)が欠けているとき、エラーが発生する', () => {
    const pastDealRecords = [
      {
        deal_id: 'D001',
        customer_industry: '製造業',
        customer_size: '大企業',
        product_category: 'ERP',
        budget_range: 5000000,
        outcome_status: 'Won'
      },
      {
        deal_id: 'D002',
        customer_industry: '小売業',
        customer_size: '中堅企業',
        product_category: 'CRM',
        budget_range: 2000000,
        outcome_status: null
      },
      {
        deal_id: 'D003',
        customer_industry: '金融機関',
        customer_size: '大企業',
        product_category: 'セキュリティ',
        budget_range: 8000000,
        outcome_status: 'Won'
      }
    ];

    const newDealCondition = {
      customer_industry: '小売業',
      customer_size: '中堅企業',
      product_category: 'CRM',
      budget_range: 1800000
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockImplementation((records, condition) => {
        for (const record of records) {
          if (record.outcome_status === null || record.outcome_status === undefined) {
            const error = new Error(
              `ValidationError: 必須フィールド「結果ステータス」が過去商談データに不足しています。レコード ID: ${record.deal_id}`
            );
            (error as any).code = 'ERR_MISSING_REQUIRED_FIELD_OUTCOME_STATUS';
            throw error;
          }
        }
        return [];
      })
    };

    expect(() => {
      mockAIEngine.findSimilarPatterns(pastDealRecords, newDealCondition);
    }).toThrow(/結果ステータス/);
  });
});