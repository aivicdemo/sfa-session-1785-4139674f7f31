import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-657
  test('行動パターン分析結果テーブルが欠落している場合、DataSourceNotFoundExceptionが発生する', () => {
    const salesPersonId = 'SP-001';
    const analysisMonth = '2024-01';
    const behaviorPatternData = null;

    const reportInput = {
      salesPersonId: salesPersonId,
      analysisMonth: analysisMonth,
      behaviorPatternAnalysisResult: behaviorPatternData,
    };

    expect(() => {
      generateBehaviorPatternAnalysisReport(reportInput);
    }).toThrow(/行動パターン分析結果テーブル/);
  });
});