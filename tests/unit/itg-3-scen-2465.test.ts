import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-2465
  test('[normal] 推奨根拠が複数存在するとき、すべての根拠情報が可視化される', () => {
    // 複数の根拠情報を含むスタブレスポンスを構築
    const mockRecommendationResult = {
      recommendationId: 'rec_20240115_001',
      customerId: 'cust_12345',
      proposedApproach: 'SaaS導入による業務効率化提案',
      confidenceScore: 92,
      rationales: [
        {
          rationaleId: 'rat_001',
          type: 'similar_success_pattern_match',
          label: '類似成功パターンマッチ度',
          value: 0.92,
          displayValue: '92%',
          description: '過去の類似顧客案件との合致度'
        },
        {
          rationaleId: 'rat_002',
          type: 'industry_conversion_rate_stat',
          label: '顧客業界別の成約率',
          value: 87,
          displayValue: '87%',
          description: '当業界での平均成約率統計'
        },
        {
          rationaleId: 'rat_003',
          type: 'proposal_implementation_track_record',
          label: '提案内容の過去導入実績',
          value: 15,
          displayValue: '15件',
          description: '同一提案内容の導入実績'
        }
      ],
      generatedAt: '2024-01-15T11:00:00Z'
    };

    // テスト対象の推奨根拠可視化機能を呼び出し
    const result = visualizeRecommendationRationale(mockRecommendationResult);

    // 根拠の数が3件であることを確認
    expect(result.rationaleDOMElements).toHaveLength(3);

    // 第1根拠（類似成功パターンマッチ度）の検証
    expect(result.rationaleDOMElements[0]).toEqual({
      elementId: 'rationale_rat_001',
      type: 'similar_success_pattern_match',
      labelText: '類似成功パターンマッチ度',
      valueText: '92%',
      descriptionText: '過去の類似顧客案件との合致度'
    });

    // 第2根拠（顧客業界別の成約率統計）の検証
    expect(result.rationaleDOMElements[1]).toEqual({
      elementId: 'rationale_rat_002',
      type: 'industry_conversion_rate_stat',
      labelText: '顧客業界別の成約率',
      valueText: '87%',
      descriptionText: '当業界での平均成約率統計'
    });

    // 第3根拠（提案内容の過去導入実績）の検証
    expect(result.rationaleDOMElements[2]).toEqual({
      elementId: 'rationale_rat_003',
      type: 'proposal_implementation_track_record',
      labelText: '提案内容の過去導入実績',
      valueText: '15件',
      descriptionText: '同一提案内容の導入実績'
    });

    // 各根拠がDOM上で個別の要素として実装されていることを確認
    expect(result.rationaleDOMElements[0].elementId).toBeDefined();
    expect(result.rationaleDOMElements[1].elementId).toBeDefined();
    expect(result.rationaleDOMElements[2].elementId).toBeDefined();

    // テキスト内容が完全一致していることを確認
    expect(result.rationaleDOMElements[0].labelText).toBe('類似成功パターンマッチ度');
    expect(result.rationaleDOMElements[0].valueText).toBe('92%');
    expect(result.rationaleDOMElements[1].labelText).toBe('顧客業界別の成約率');
    expect(result.rationaleDOMElements[1].valueText).toBe('87%');
    expect(result.rationaleDOMElements[2].labelText).toBe('提案内容の過去導入実績');
    expect(result.rationaleDOMElements[2].valueText).toBe('15件');

    // 可視化結果の正常完了を検証
    expect(result.isSuccessful).toBe(true);
    expect(result.totalRationalCount).toBe(3);
  });
});