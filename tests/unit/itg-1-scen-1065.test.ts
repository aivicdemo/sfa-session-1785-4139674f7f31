import { analyzeAndSelectIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1065
  test('行動パターン分析指標自動選定機能 - 成約実績データが存在しない場合にエラーが発生する', () => {
    const input = {
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      targetSalesPersonIds: ['SP001', 'SP002'],
      contractDataSource: {
        fetchContracts: async () => {
          return [];
        },
      },
    };

    const result = analyzeAndSelectIndicators(input);

    expect(result).toBeDefined();
    expect(result.errorCode).toBe('ERR_NO_CONTRACT_DATA');
    expect(result.errorMessage).toMatch(/成約実績データが存在しません/);
    expect(result.errorMessage).toMatch(/分析対象期間を変更して再度お試しください/);
    expect(result.stackTrace).toBeDefined();
    expect(typeof result.stackTrace).toBe('string');
    expect(result.stackTrace.length).toBeGreaterThan(0);
  });
});