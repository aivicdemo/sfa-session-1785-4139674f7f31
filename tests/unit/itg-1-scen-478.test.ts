import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-478: [error] 営業担当者ごとの行動パターン分析レポート生成機能 - 行動パターン分析結果テーブルが欠落している場合、エラーを返す
  test('行動パターン分析結果テーブルが欠落している場合、ERR_ANALYSIS_TABLE_NOT_FOUNDエラーを返す', async () => {
    const { generateBehaviorPatternAnalysisReport } = await import(
      '../../src/logic/it-1-br-2-1-1'
    );

    const employee_id = 'EMP-001';
    const analysis_period_start = '2024-01-01T00:00:00Z';
    const analysis_period_end = '2024-01-31T23:59:59Z';

    const mockQueryResult = new Error(
      '行動パターン分析結果テーブルが見つかりません。システム管理者に連絡してください。'
    );
    (mockQueryResult as any).code = 'ERR_ANALYSIS_TABLE_NOT_FOUND';
    (mockQueryResult as any).statusCode = 500;

    try {
      await generateBehaviorPatternAnalysisReport({
        employee_id,
        analysis_period_start,
        analysis_period_end,
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).code).toBe('ERR_ANALYSIS_TABLE_NOT_FOUND');
      expect((error as any).statusCode).toBe(500);
      expect((error as Error).message).toMatch(/行動パターン分析結果テーブル/);
    }
  });
});