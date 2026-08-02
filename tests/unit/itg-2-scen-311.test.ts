import { decideImprovementPriority } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 改善指導優先順位の決定', () => {
  // SCEN-311
  test('[edge] スコアが最低点より1ポイント高い営業担当者が優先度2が付与される', () => {
    const threshold = 70;
    const salesPersonScore = 71;
    const salesPersonId = 'A';

    const result = decideImprovementPriority({
      threshold,
      score: salesPersonScore,
      salesperson_id: salesPersonId,
    });

    expect(result.priority).toBe(2);
    expect(result.salesperson_id).toBe(salesPersonId);
  });
});