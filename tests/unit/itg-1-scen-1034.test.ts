import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-1034: 分析対象期間の終了日が欠落しているとき処理がエラーになること', () => {
    // Arrange
    const input = {
      employeeId: 'EMP-001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: null,
    };

    // Act
    const result = generateSalesActivityPatternAnalysisReport(
      input.employeeId,
      input.analysisStartDate,
      input.analysisEndDate
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.errorCode).toBe('ERR_MISSING_END_DATE');
    expect(result.errorMessage).toMatch(/分析対象期間の終了日/);
    expect(result.reportData).toBeNull();
  });
});