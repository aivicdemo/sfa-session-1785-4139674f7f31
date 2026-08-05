import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-557
  test('行動パターン分析結果の営業担当者IDが欠落している場合、エラーになる', () => {
    const analysisInput = {
      salesPersonId: null,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    };

    expect(() => generateSalesPersonAnalysisReport(analysisInput)).toThrow(/営業担当者ID/);
  });
});