import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-743
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス定義が1件の場合、その定義に基づいて分析対象指標が選定される', () => {
    const processDef = {
      processId: 'PROC-001',
      processName: '初回提案～受注',
      targetIndicators: ['提案日数', '初回接触から提案までの期間', '提案から受注までの期間']
    };

    const result = selectAnalysisIndicators([processDef]);

    expect(result.selectedIndicators).toEqual([
      '提案日数',
      '初回接触から提案までの期間',
      '提案から受注までの期間'
    ]);
    expect(result.selectionReason).toContain('PROC-001');
  });
});