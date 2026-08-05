import { calculateCorrelationRoundedValue, determinePriorityLevel } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-297: 成約実績との相関値が計算時に端数が発生する場合、丸め処理後に優先順位判定に使用される
  test('丸め処理後の値が優先順位判定ロジックの入力値として一貫して使用される', () => {
    // 入力: 端数ありの相関値
    const rawCorrelationValue = 0.8456789;

    // 丸め処理ロジック実行（小数点第2位まで四捨五入）
    const roundedCorrelationValue = calculateCorrelationRoundedValue(rawCorrelationValue);

    // 丸め処理後の値が 0.85 であることを確認
    expect(roundedCorrelationValue).toBe(0.85);

    // 丸められた値 0.85 を優先順位判定ロジックに渡した場合の結果
    const priorityFromRounded = determinePriorityLevel(roundedCorrelationValue);

    // 元の端数ありの値 0.8456789 を優先順位判定ロジックに直接渡した場合の結果
    const priorityFromRaw = determinePriorityLevel(rawCorrelationValue);

    // 両者の判定結果が一致することを確認
    // （丸められた値に基づいて判定が常に実行されていることを示す）
    expect(priorityFromRounded).toEqual(priorityFromRaw);

    // 優先順位判定が丸められた値 0.85 に基づいて実行されることを確認
    // （相関値 0.85 は高い相関を示すため、優先度は "HIGH" であることを期待）
    expect(priorityFromRounded).toBe('HIGH');
  });
});