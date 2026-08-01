import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析対象指標の自動選定', () => {
  // SCEN-770
  test('同じ入力条件で2回実行しても同じ分析対象指標リストが返される', () => {
    const inputCondition = {
      department: '営業部',
      period: '2024年1月',
      dataSource: 'CRM',
      threshold: 70,
    };

    const firstResult = selectAnalysisIndicators(inputCondition);
    const secondResult = selectAnalysisIndicators(inputCondition);

    const expected = ['成約率', '初回接触数', '商談化率', '平均契約金額'];

    expect(firstResult).toEqual(expected);
    expect(secondResult).toEqual(expected);
    expect(firstResult.length).toBe(secondResult.length);
    expect(firstResult).toEqual(secondResult);
  });
});