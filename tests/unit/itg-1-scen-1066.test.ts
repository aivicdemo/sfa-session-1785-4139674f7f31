import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  test('SCEN-1066: 営業担当者IDが未指定の場合にエラーが発生する', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');
    const indicatorCategory = 'sales_process_compliance';

    // パターン1: 営業担当者IDが空文字列の場合
    expect(() =>
      selectAnalysisIndicators({
        salesPersonId: '',
        analysisStartDate,
        analysisEndDate,
        indicatorCategory,
      })
    ).toThrow(/営業担当者ID/);

    // パターン2: 営業担当者IDが null の場合
    expect(() =>
      selectAnalysisIndicators({
        salesPersonId: null as any,
        analysisStartDate,
        analysisEndDate,
        indicatorCategory,
      })
    ).toThrow(/営業担当者ID/);

    // パターン3: 営業担当者IDが undefined の場合
    expect(() =>
      selectAnalysisIndicators({
        salesPersonId: undefined as any,
        analysisStartDate,
        analysisEndDate,
        indicatorCategory,
      })
    ).toThrow(/営業担当者ID/);
  });
});