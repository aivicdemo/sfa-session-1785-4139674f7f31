import { calculatePriorityRankForCoachingIntervention } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-261: [normal] 行動パターン分析と改善指導優先順位判定機能 - 標準プロセス乖離度が大きく成約実績が低い営業担当者が、改善指導の最優先対象として判定される
  test('should rank sales rep A as highest priority for coaching intervention when deviations are high and deal count is low', () => {
    // Arrange: テストデータ準備
    const salesRepA = {
      sales_rep_id: 'A001',
      name: '営業担当者A',
      process_deviation_rate: 85, // 標準プロセス乖離度 85%（閾値70%以上）
      monthly_deal_count: 2, // 月間成約実績 2件（同職種平均 8件）
      team_average_deal_count: 8,
    };

    const salesRepB = {
      sales_rep_id: 'B001',
      name: '営業担当者B',
      process_deviation_rate: 60, // 乖離度 60%（閾値未満）
      monthly_deal_count: 7, // 成約実績 7件（平均に接近）
      team_average_deal_count: 8,
    };

    const salesRepC = {
      sales_rep_id: 'C001',
      name: '営業担当者C',
      process_deviation_rate: 75, // 乖離度 75%（閾値以上だが）
      monthly_deal_count: 3, // 成約実績 3件（平均より低い）
      team_average_deal_count: 8,
    };

    const sales_reps = [salesRepA, salesRepB, salesRepC];

    const deviation_threshold = 70;
    const average_deal_threshold = 8;

    // Act: 改善指導優先順位判定機能を実行
    const result = calculatePriorityRankForCoachingIntervention({
      sales_reps,
      deviation_threshold,
      average_deal_threshold,
    });

    // Assert: 営業担当者Aが最優先（ランク1位）として判定されることを確認
    const repAResult = result.find((r) => r.sales_rep_id === 'A001');
    expect(repAResult).toBeDefined();
    expect(repAResult?.priority_rank).toBe(1);
    expect(repAResult?.coaching_required).toBe(true);
    expect(repAResult?.reasoning).toContain('乖離度85');
    expect(repAResult?.reasoning).toContain('成約実績2件');

    // Assert: 営業担当者Bが最も優先度が低い（ランク3位）として判定されることを確認
    const repBResult = result.find((r) => r.sales_rep_id === 'B001');
    expect(repBResult).toBeDefined();
    expect(repBResult?.priority_rank).toBe(3);
    expect(repBResult?.coaching_required).toBe(false);

    // Assert: 営業担当者Cが中間の優先度（ランク2位）として判定されることを確認
    const repCResult = result.find((r) => r.sales_rep_id === 'C001');
    expect(repCResult).toBeDefined();
    expect(repCResult?.priority_rank).toBe(2);
    expect(repCResult?.coaching_required).toBe(true);

    // Assert: 結果の順序が優先度の降順であることを確認
    expect(result[0].sales_rep_id).toBe('A001');
    expect(result[1].sales_rep_id).toBe('C001');
    expect(result[2].sales_rep_id).toBe('B001');

    // Assert: 判定根拠が「標準プロセス乖離度が高く成約実績が低い同一人物」の組み合わせであることを確認
    expect(repAResult?.reasoning).toMatch(/乖離度/);
    expect(repAResult?.reasoning).toMatch(/成約/);
    expect(repAResult?.reasoning).toMatch(/改善指導/);
  });
});