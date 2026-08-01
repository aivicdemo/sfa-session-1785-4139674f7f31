import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-335: 改善指導の優先順位が乖離度に基づいて正しく決定される', () => {
    const salesRepA = {
      repId: 'REP-001',
      repName: '営業担当者A',
      deviationScore: 0.85,
    };

    const salesRepB = {
      repId: 'REP-002',
      repName: '営業担当者B',
      deviationScore: 0.62,
    };

    const salesRepC = {
      repId: 'REP-003',
      repName: '営業担当者C',
      deviationScore: 0.45,
    };

    const salesReps = [salesRepA, salesRepB, salesRepC];

    const report = generateSalesRepBehaviorAnalysisReport(salesReps);

    expect(report.improvementDirectionPriority).toEqual([
      {
        rank: 1,
        repId: 'REP-001',
        repName: '営業担当者A',
        deviationScore: 0.85,
      },
      {
        rank: 2,
        repId: 'REP-002',
        repName: '営業担当者B',
        deviationScore: 0.62,
      },
      {
        rank: 3,
        repId: 'REP-003',
        repName: '営業担当者C',
        deviationScore: 0.45,
      },
    ]);
  });
});