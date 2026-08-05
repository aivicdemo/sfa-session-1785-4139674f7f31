import { determineImprovementPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-254: 乖離パターン判定機能 - 複数の営業担当者の乖離パターンが逆順で入力されたとき改善優先度が正しく決定される', () => {
    // 逆順（改善優先度が低い順）で乖離パターンデータを入力
    const divergencePatterns = [
      {
        salesPersonId: 'C',
        salesPersonName: '営業担当者C',
        divergencePattern: '過度な値引き',
        divergenceScoreValue: 45,
      },
      {
        salesPersonId: 'B',
        salesPersonName: '営業担当者B',
        divergencePattern: '目標未達成',
        divergenceScoreValue: 72,
      },
      {
        salesPersonId: 'A',
        salesPersonName: '営業担当者A',
        divergencePattern: '架空案件計上',
        divergenceScoreValue: 98,
      },
    ];

    // 改善優先度の決定処理を実行
    const result = determineImprovementPriority(divergencePatterns);

    // 乖離度スコアの高い順に正しく再排序されていることを確認
    expect(result).toEqual([
      {
        salesPersonId: 'A',
        salesPersonName: '営業担当者A',
        divergencePattern: '架空案件計上',
        divergenceScoreValue: 98,
        improvementPriority: 1,
      },
      {
        salesPersonId: 'B',
        salesPersonName: '営業担当者B',
        divergencePattern: '目標未達成',
        divergenceScoreValue: 72,
        improvementPriority: 2,
      },
      {
        salesPersonId: 'C',
        salesPersonName: '営業担当者C',
        divergencePattern: '過度な値引き',
        divergenceScoreValue: 45,
        improvementPriority: 3,
      },
    ]);

    // 優先度順序の検証
    expect(result[0].improvementPriority).toBe(1);
    expect(result[0].divergenceScoreValue).toBe(98);
    expect(result[1].improvementPriority).toBe(2);
    expect(result[1].divergenceScoreValue).toBe(72);
    expect(result[2].improvementPriority).toBe(3);
    expect(result[2].divergenceScoreValue).toBe(45);
  });
});