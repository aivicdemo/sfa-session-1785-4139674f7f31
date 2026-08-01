import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析・レポート機能', () => {
  // SCEN-744
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス定義が複数件の場合、すべての定義から分析対象指標が抽出される', () => {
    const processDefinitionA = {
      id: 'process-def-a',
      name: '営業プロセス定義A',
      indicators: ['成約率', '商談数', '平均商談期間'],
    };

    const processDefinitionB = {
      id: 'process-def-b',
      name: '営業プロセス定義B',
      indicators: ['初回接触率', '提案数', '顧客満足度'],
    };

    const processDefinitionC = {
      id: 'process-def-c',
      name: '営業プロセス定義C',
      indicators: ['フォローアップ完了率', '案件化率'],
    };

    const processDefinitions = [
      processDefinitionA,
      processDefinitionB,
      processDefinitionC,
    ];

    const selectedIndicators = selectAnalysisIndicators(processDefinitions);

    const expectedIndicators = [
      '成約率',
      '商談数',
      '平均商談期間',
      '初回接触率',
      '提案数',
      '顧客満足度',
      'フォローアップ完了率',
      '案件化率',
    ];

    expect(selectedIndicators).toEqual(expectedIndicators);
    expect(selectedIndicators.length).toBe(8);
    expect(new Set(selectedIndicators).size).toBe(8);
  });
});