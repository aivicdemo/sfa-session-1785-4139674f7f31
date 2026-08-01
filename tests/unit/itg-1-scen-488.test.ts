import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-488: [normal] AIエージェント推論精度スコア算出機能 - AIエージェントの推論結果が完全に正確な場合、精度スコアが100で算出される', () => {
    const inference_results = [
      {
        inference_id: 'inf_001',
        agent_output: '提案1: 顧客Aに対して初回接触推奨',
        correct_answer: '提案1: 顧客Aに対して初回接触推奨',
        is_correct: true,
      },
      {
        inference_id: 'inf_002',
        agent_output: '提案2: 顧客Bに対してフォローアップ推奨',
        correct_answer: '提案2: 顧客Bに対してフォローアップ推奨',
        is_correct: true,
      },
      {
        inference_id: 'inf_003',
        agent_output: '提案3: 顧客Cに対して値下げ交渉推奨',
        correct_answer: '提案3: 顧客Cに対して値下げ交渉推奨',
        is_correct: true,
      },
      {
        inference_id: 'inf_004',
        agent_output: '提案4: 顧客Dに対して提案資料再送推奨',
        correct_answer: '提案4: 顧客Dに対して提案資料再送推奨',
        is_correct: true,
      },
      {
        inference_id: 'inf_005',
        agent_output: '提案5: 顧客Eに対して商談クローズ推奨',
        correct_answer: '提案5: 顧客Eに対して商談クローズ推奨',
        is_correct: true,
      },
    ];

    const accuracy_score = calculateInferenceAccuracyScore(inference_results);

    expect(accuracy_score).toBe(100);
  });
});