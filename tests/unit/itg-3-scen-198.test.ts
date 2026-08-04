import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件へ推奨する機能', () => {
  // SCEN-198
  test('OpenAI APIが応答不可のとき、内部推奨パターンマスタから統計的上位の成功パターンが代替として返却される', async () => {
    const new_deal_request = {
      customer_industry: 'IT',
      customer_issue: 'コスト削減',
      budget_scale: 5000000,
      deal_stage: '初期接触',
    };

    const recommendation_pattern_master = [
      {
        pattern_id: 'pat_001',
        industry: 'IT',
        issue_type: 'コスト削減',
        approach_name: 'インフラ最適化提案',
        success_rate: 0.78,
        case_count: 32,
        brief_reason: '過去の成功パターンから選択',
      },
      {
        pattern_id: 'pat_002',
        industry: 'IT',
        issue_type: 'コスト削減',
        approach_name: 'ライセンス統合提案',
        success_rate: 0.72,
        case_count: 28,
        brief_reason: '過去の成功パターンから選択',
      },
      {
        pattern_id: 'pat_003',
        industry: 'IT',
        issue_type: 'コスト削減',
        approach_name: 'クラウド移行提案',
        success_rate: 0.65,
        case_count: 20,
        brief_reason: '過去の成功パターンから選択',
      },
    ];

    let retry_count = 0;
    const mock_ai_engine = {
      generateRecommendation: jest.fn(async () => {
        retry_count++;
        if (retry_count <= 3) {
          await new Promise((_, reject) =>
            setTimeout(() => reject(new Error('API Timeout')), 100)
          );
        }
        return null;
      }),
    };

    const result = await generateRecommendation(
      new_deal_request,
      recommendation_pattern_master,
      mock_ai_engine
    );

    expect(retry_count).toBe(3);
    expect(result.fallback_mode).toBe(true);
    expect(result.source_type).toBe('patternMaster');
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );
    expect(result.recommended_patterns).toHaveLength(3);
    expect(result.recommended_patterns[0].pattern_id).toBe('pat_001');
    expect(result.recommended_patterns[0].success_rate).toBe(0.78);
    expect(result.recommended_patterns[0].approach_name).toBe(
      'インフラ最適化提案'
    );
    expect(result.recommended_patterns[1].pattern_id).toBe('pat_002');
    expect(result.recommended_patterns[1].success_rate).toBe(0.72);
    expect(result.recommended_patterns[2].pattern_id).toBe('pat_003');
    expect(result.recommended_patterns[2].success_rate).toBe(0.65);
    expect(result.brief_reasoning).toBe('過去の成功パターンから選択');
    expect(result.detailed_reasoning).toBeUndefined();
  });
});