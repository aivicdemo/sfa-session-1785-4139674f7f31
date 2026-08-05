import { generateJustification } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-396
  test('[error] 成功パターンマトリクス適用判定機能 - 実行タイミング判定データが null のとき判断根拠が生成できない', () => {
    const judgment_data_object = {
      executionTimingDecision: null,
      customerAttributes: {
        industry: 'technology',
        company_size: 'large',
        revenue: 50000000,
      },
      deal_stage: 'proposal',
      success_pattern_id: 'pat_001',
      confidence_score: 0.85,
    };

    expect(() => generateJustification(judgment_data_object)).toThrow(/実行タイミング判定データが必須です/);
  });
});