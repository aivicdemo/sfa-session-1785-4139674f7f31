import { analyzeCareerPatternAndDealOutcome } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-617
  test('[error] 成功パターンマスタデータが欠落しているときエラーになる', () => {
    const input = {
      salesRepId: 'SR001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      successPatternMasterData: null,
    };

    expect(() => analyzeCareerPatternAndDealOutcome(input)).toThrow(/MASTER_DATA_MISSING|成功パターンマスタデータ/);
  });
});