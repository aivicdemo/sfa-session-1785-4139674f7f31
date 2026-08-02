import { analyzeExecutionStatus } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析エンジン', () => {
  // SCEN-842
  test('営業担当者IDが未指定のときエラーを返す', () => {
    const input = {
      salesPersonId: '',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      targetProcessStage: 'initial_contact',
    };

    expect(() => analyzeExecutionStatus(input)).toThrow(/営業担当者ID/);
  });
});