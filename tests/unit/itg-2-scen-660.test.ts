import { describe, test, expect, beforeEach } from '@jest/globals';
import { getRecommendationJustification } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-660
  test('推奨内容根拠の可視化機能 - 推奨履歴から過去推奨内容が複数件のとき、すべての履歴が根拠として組み込まれる', () => {
    const opportunity_id = 'OPP-20240110-001';
    const recommendation_histories = [
      {
        recommendation_id: 'REC-001',
        opportunity_id: opportunity_id,
        recommendation_date: '2024-01-10',
        recommendation_content: '提案資料送付',
        reason: '初期接触後の標準フォローアップ',
        created_at: '2024-01-10T09:00:00Z',
      },
      {
        recommendation_id: 'REC-002',
        opportunity_id: opportunity_id,
        recommendation_date: '2024-01-15',
        recommendation_content: 'フォローアップ営電',
        reason: '提案資料送付後の客先反応確認',
        created_at: '2024-01-15T14:30:00Z',
      },
      {
        recommendation_id: 'REC-003',
        opportunity_id: opportunity_id,
        recommendation_date: '2024-01-20',
        recommendation_content: '見積提出',
        reason: '顧客の購買意思確認後の提案深堀',
        created_at: '2024-01-20T10:15:00Z',
      },
    ];

    const result = getRecommendationJustification({
      opportunity_id: opportunity_id,
      recommendation_histories: recommendation_histories,
    });

    expect(result.justification_histories).toHaveLength(3);
    expect(result.justification_histories[0]).toEqual({
      recommendation_id: 'REC-001',
      recommendation_date: '2024-01-10',
      recommendation_content: '提案資料送付',
      reason: '初期接触後の標準フォローアップ',
    });
    expect(result.justification_histories[1]).toEqual({
      recommendation_id: 'REC-002',
      recommendation_date: '2024-01-15',
      recommendation_content: 'フォローアップ営電',
      reason: '提案資料送付後の客先反応確認',
    });
    expect(result.justification_histories[2]).toEqual({
      recommendation_id: 'REC-003',
      recommendation_date: '2024-01-20',
      recommendation_content: '見積提出',
      reason: '顧客の購買意思確認後の提案深堀',
    });
    expect(result.total_count).toBe(3);
    expect(result.is_all_histories_included).toBe(true);
  });
});