import { analyzeAndSelectIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析指標自動選定機能', () => {
  // SCEN-1064
  test('営業プロセス定義が存在しない場合にエラーが発生する', () => {
    const missingProcessDefinitionId = 'PROC_DEF_NONEXISTENT_12345';

    expect(() => {
      analyzeAndSelectIndicators({
        salesProcessDefinitionId: missingProcessDefinitionId,
      });
    }).toThrow(/営業プロセス定義/);
  });
});