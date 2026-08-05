import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-705: [error] 営業活動種別が登録済み活動種別に存在しないとき活動分類処理がエラーになる
  test('should throw ACTIVITY_TYPE_NOT_FOUND error when activity type does not exist in master', () => {
    const sales_activity_data = {
      id: 'SA_001',
      sales_representative_id: 'SR_001',
      customer_id: 'C_001',
      activity_type: 'プレゼンテーション',
      activity_date: '2024-01-15T14:00:00Z',
      duration_minutes: 60,
      notes: 'Product presentation to customer'
    };

    const registered_activity_types = [
      { id: 'AT_001', name: '訪問' },
      { id: 'AT_002', name: '電話' },
      { id: 'AT_003', name: 'メール' }
    ];

    const analysis_context = {
      sales_activities: [sales_activity_data],
      registered_activity_type_master: registered_activity_types,
      analysis_period_start: '2024-01-01T00:00:00Z',
      analysis_period_end: '2024-01-31T23:59:59Z'
    };

    expect(() => 
      generateSalesActivityPatternAnalysisReport(analysis_context)
    ).toThrow(/プレゼンテーション/);
  });
});