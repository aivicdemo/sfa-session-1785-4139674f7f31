import { describe, test, expect } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-697
  test('成約実績データが null のとき成約率計算処理がエラーになる', () => {
    const salesRepWithNullConversionData = {
      sales_rep_id: 'SR001',
      sales_rep_name: '営業太郎',
      contact_frequency: 15,
      proposal_count: 8,
      follow_up_interval_days: 3,
      conversion_results: null as any,
    };

    expect(() => {
      generateSalesRepBehaviorAnalysisReport(salesRepWithNullConversionData);
    }).toThrow(/成約実績データが存在しません/);
  });
});