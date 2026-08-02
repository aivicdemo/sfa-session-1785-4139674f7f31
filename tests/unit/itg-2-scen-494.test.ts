import { calculateDuplicateDetectionPriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-494
  test('重複検知ルール実行優先度決定機能 - 品質リスク度合いと検知効率の両方が同じスケール範囲にあるときに計算が正確である', () => {
    const qualityRiskDegree = 0.6;
    const detectionEfficiency = 0.65;
    
    const priorityScore = calculateDuplicateDetectionPriority({
      qualityRiskDegree,
      detectionEfficiency,
    });
    
    const expectedPriorityScore = qualityRiskDegree * 0.4 + detectionEfficiency * 0.6;
    
    expect(priorityScore).toBe(0.63);
    expect(Math.round(priorityScore * 100) / 100).toBe(expectedPriorityScore);
  });
});