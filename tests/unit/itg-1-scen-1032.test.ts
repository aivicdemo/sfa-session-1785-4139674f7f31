import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1032: [error] 営業担当者ごとの行動パターン分析レポート生成機能 - 分析対象の営業担当者IDが欠落しているとき処理がエラーになること
  it('should throw error with MISSING_SALES_PERSON_ID when sales person ID is null', () => {
    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        sales_person_id: null,
        analysis_start_date: '2024-01-01',
        analysis_end_date: '2024-01-31',
      })
    ).toThrow(/営業担当者ID/);
  });
});