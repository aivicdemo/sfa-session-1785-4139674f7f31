import { selectBehaviorAnalysisMetrics } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-751
  test('行動パターン分析対象指標の自動選定機能 - 提案成功率がプロセス標準書に定義されていない場合、分析対象指標に含まれない', () => {
    const processStandardDefinition = {
      metrics: [
        {
          metricId: 'M001',
          metricName: '初回接触率',
          definition: '営業担当者が新規顧客に初回接触した案件数 / 対象期間の新規案件総数',
          unit: 'percentage',
          threshold: 80,
        },
        {
          metricId: 'M002',
          metricName: '商談化率',
          definition: '初回接触後に商談に進んだ案件数 / 初回接触実績案件数',
          unit: 'percentage',
          threshold: 50,
        },
        {
          metricId: 'M003',
          metricName: 'フォローアップ間隔',
          definition: 'フォローアップ実施日から次回フォローアップ実施日までの日数',
          unit: 'days',
          threshold: 14,
        },
      ],
    };

    const selectedMetrics = selectBehaviorAnalysisMetrics(processStandardDefinition);

    expect(selectedMetrics).toHaveLength(3);
    expect(selectedMetrics.map((m) => m.metricName)).toEqual([
      '初回接触率',
      '商談化率',
      'フォローアップ間隔',
    ]);
    expect(selectedMetrics.map((m) => m.metricName)).not.toContain('提案成功率');
  });
});