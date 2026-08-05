import { calculateImprovementPriority } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-871: [normal] 改善優先度判定機能 - 乖離度が小さい営業担当者が低優先度に判定される', () => {
    // セットアップ：営業担当者の乖離度とKPI実績データ
    const salesRepA = {
      id: 'rep_001',
      name: '営業担当者A',
      deviationRate: 0.02, // 2%
      targetRevenue: 1000000, // 100万円
      actualRevenue: 980000, // 98万円
    };

    const salesRepB = {
      id: 'rep_002',
      name: '営業担当者B',
      deviationRate: 0.15, // 15%
      targetRevenue: 1000000,
      actualRevenue: 850000, // 85万円
    };

    const salesRepC = {
      id: 'rep_003',
      name: '営業担当者C',
      deviationRate: 0.08, // 8%
      targetRevenue: 1000000,
      actualRevenue: 920000, // 92万円
    };

    const salesReps = [salesRepA, salesRepB, salesRepC];

    // 改善優先度判定機能を実行
    const priorityResultA = calculateImprovementPriority(salesRepA);
    const priorityResultB = calculateImprovementPriority(salesRepB);
    const priorityResultC = calculateImprovementPriority(salesRepC);

    // 期待結果：営業担当者Aの優先度が最も低い
    expect(priorityResultA.priority).toBe(1);
    expect(priorityResultB.priority).toBe(3);
    expect(priorityResultC.priority).toBe(2);

    // 優先度スコアの比較：A < C < B
    expect(priorityResultA.priority).toBeLessThan(priorityResultC.priority);
    expect(priorityResultC.priority).toBeLessThan(priorityResultB.priority);

    // 乖離度が小さい（2%）営業担当者Aが低優先度（優先度1）に判定されることを確認
    expect(priorityResultA.deviationRate).toBe(0.02);
    expect(priorityResultA.priority).toBeGreaterThanOrEqual(1);
    expect(priorityResultA.priority).toBeLessThanOrEqual(3);
  });
});