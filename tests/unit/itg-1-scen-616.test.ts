import { analyzeActionPatternAndSalesResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-616: [error] 営業担当者の行動パターンと成約実績の自動分析・レポート機能 - 標準プロセス定義データが欠落しているときエラーになる
  test('標準プロセス定義データが欠落している場合、エラーが発生する', () => {
    const input = {
      salesPersonId: 'SP001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      processDefinition: null,
      actionPatternData: [
        {
          actionId: 'ACT001',
          actionType: 'initial_contact',
          executionDate: '2024-01-15',
          completedSteps: 1,
        },
      ],
      salesResultData: [
        {
          salesCaseId: 'CASE001',
          closedDate: '2024-01-20',
          isWon: true,
          contractAmount: 500000,
        },
      ],
    };

    expect(() => analyzeActionPatternAndSalesResults(input)).toThrow(
      /PROCESS_DEF_MISSING/
    );
  });
});