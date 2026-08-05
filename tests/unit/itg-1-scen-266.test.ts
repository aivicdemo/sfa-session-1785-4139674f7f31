import { calculateDeviationScore, judgeImprovementPriority } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-266
  test('行動パターン分析と改善指導優先順位判定機能 - 商談進捗が複数件、提案内容が複数件、顧客接触頻度が0件の組み合わせで乖離度が計算され、改善指導内容が判定される', () => {
    // テストデータ準備：営業担当者Aのデータセット
    const businessProgressData = [
      { progress_rate: 60 },
      { progress_rate: 40 }
    ];

    const proposalData = [
      { proposal_date: new Date('2024-01-10T09:00:00Z') },
      { proposal_date: new Date('2024-01-15T14:30:00Z') }
    ];

    const customerContactFrequencyData: any[] = [];

    // 乖離度計算ロジック実行
    const deviationScore = calculateDeviationScore({
      business_progress_data: businessProgressData,
      proposal_data: proposalData,
      customer_contact_frequency_data: customerContactFrequencyData
    });

    // 乖離度スコア検証：顧客接触頻度0件を反映した値として72ポイント
    expect(deviationScore).toBe(72);

    // 改善指導優先順位判定機能実行
    const improvementGuidance = judgeImprovementPriority({
      deviation_score: deviationScore
    });

    // 判定結果検証：改善指導内容と優先度
    expect(improvementGuidance.guidance_content).toBe('顧客接触頻度が不足しています。週3回以上の接触を目標に営業活動計画を見直してください');
    expect(improvementGuidance.priority_level).toBe('高');
  });
});