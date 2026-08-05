import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-320: [normal] 同じ営業担当者データで2回実行した場合に同じレポート結果が出力される', () => {
    // 準備: 営業担当者ID「sales_001」の過去30日間の行動データ
    const sales_rep_id = 'sales_001';
    const analysis_period_days = 30;
    
    const behavior_data = {
      sales_rep_id: sales_rep_id,
      visit_count: 15,
      phone_call_count: 8,
      email_count: 23,
      deal_closed_count: 3,
    };

    // 第1回目の実行: 行動パターン分析レポート生成
    const first_report = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      analysis_period_days: analysis_period_days,
      behavior_data: behavior_data,
    });

    // 第1回目のレポート結果を保存
    const first_behavior_score = first_report.behavior_score;
    const first_pattern_classification = first_report.pattern_classification;
    const first_recommended_action = first_report.recommended_action;
    const first_chart_data = JSON.stringify(first_report.chart_data);

    // 第2回目の実行: 同じデータで再度実行
    const second_report = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      analysis_period_days: analysis_period_days,
      behavior_data: behavior_data,
    });

    // 期待結果: 第1回目と第2回目のレポート結果が完全に一致
    expect(second_report.behavior_score).toBe(first_behavior_score);
    expect(second_report.pattern_classification).toBe(first_pattern_classification);
    expect(second_report.recommended_action).toBe(first_recommended_action);
    expect(JSON.stringify(second_report.chart_data)).toBe(first_chart_data);
    
    // 具体的な期待値の検証（ビジネスルール反映）
    // 行動パターン分析: 訪問15件、電話8件、メール23件、成約3件
    // 行動スコア算出: (訪問件数 × 1.0 + 電話件数 × 1.2 + メール件数 × 0.8) / 総行動数 × 100
    // = (15 × 1.0 + 8 × 1.2 + 23 × 0.8) / 46 × 100 = (15 + 9.6 + 18.4) / 46 × 100 = 43 / 46 × 100 = 93.48
    const expected_behavior_score = 93.48;
    expect(first_report.behavior_score).toBeCloseTo(expected_behavior_score, 2);
    
    // パターン分類: メール件数が最も多い（23件）ため「効率志向型」
    expect(first_report.pattern_classification).toBe('効率志向型');
    
    // 推奨アクション: メール割合が50%以上のため、メールフォローアップの継続推奨
    expect(first_report.recommended_action).toContain('メール');
    
    // チャートデータの検証: 訪問・電話・メール各件数の内訳が正確
    expect(first_report.chart_data).toEqual({
      visit_count: 15,
      phone_call_count: 8,
      email_count: 23,
      total_contact_count: 46,
    });
  });
});