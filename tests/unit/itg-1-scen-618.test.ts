import { analyzeBusinessPatternAndAchievement } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-618
  test('成功パターンマスタデータが空配列のときエラーになる', () => {
    const salesPersonId = 'SP001';
    const analysisMonth = '2024-01';
    const successPatternMaster = [];

    expect(() =>
      analyzeBusinessPatternAndAchievement({
        salesPersonId,
        analysisMonth,
        successPatternMaster,
      })
    ).toThrow(/成功パターンマスタデータ/);
  });
});