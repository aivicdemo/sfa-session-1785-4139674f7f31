import { judgeApproachFromSuccessMatrix } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-276
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 適用可能なアプローチが特定された場合、推奨提案内容と実行タイミングの判断根拠が提示される', () => {
    const successPatrixInput = {
      industry: '製造業',
      product: '生産管理システム',
      customerScale: '中堅企業',
      successRate: 85,
      recommendedApproach: '段階導入型',
      recommendedExecutionTiming: 'Q2',
      judgmentBasis: '同業他社での導入実績3件、平均導入期間6ヶ月'
    };

    const customerInput = {
      industry: '製造業',
      product: '生産管理システム',
      customerScale: '中堅企業'
    };

    const result = judgeApproachFromSuccessMatrix(successPatrixInput, customerInput);

    expect(result).toEqual({
      applicableApproach: '段階導入型',
      recommendedProposalContent: '第1段階で基本モジュール導入、第2段階で拡張機能追加の2段階導入を提案',
      executionTiming: 'Q2（理由：導入準備期間2ヶ月、運用開始期間4ヶ月を想定）',
      judgmentBasis: '同業他社での導入実績3件、平均導入期間6ヶ月、成功率85%に基づき判定',
      matchingConfidence: '高'
    });
  });
});