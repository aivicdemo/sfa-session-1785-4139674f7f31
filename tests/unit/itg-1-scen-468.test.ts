import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesRepAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-468
  test('営業担当者IDが欠落している場合、エラーを返す', () => {
    const input = {
      salesRepId: null,
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-01-31T23:59:59Z'),
      includeDeviationAnalysis: true,
      includeCorrelationAnalysis: true,
    };

    const executeReport = () => generateSalesRepAnalysisReport(input);

    expect(executeReport).toThrow(/営業担当者ID/);
  });
});