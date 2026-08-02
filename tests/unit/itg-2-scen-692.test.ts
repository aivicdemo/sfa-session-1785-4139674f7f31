import { getRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-692
  test('推奨内容根拠の可視化機能 - 過去事例の顧客属性が部分一致するとき、その事例が根拠として抽出される', () => {
    // 過去事例A: 業種=製造業、従業員数=500～1000名、地域=関東
    const pastCase = {
      case_id: 'CASE_A_001',
      industry: '製造業',
      employee_count_min: 500,
      employee_count_max: 1000,
      region: '関東',
      description: '過去事例A'
    };

    // 現在の対象顧客B: 業種=製造業、従業員数=800名、地域=関東、業界=自動車部品
    const targetCustomer = {
      customer_id: 'CUST_B_001',
      industry: '製造業',
      employee_count: 800,
      region: '関東',
      business_category: '自動車部品'
    };

    // 推奨内容根拠の可視化機能を呼び出す
    const result = getRecommendationBasis({
      target_customer: targetCustomer,
      past_cases: [pastCase],
      match_threshold: 2
    });

    // 期待結果: 過去事例A が根拠として抽出され、合致属性を含む
    expect(result).toEqual({
      basis_cases: [
        {
          case_id: 'CASE_A_001',
          description: '過去事例A',
          matched_attributes: ['業種', '従業員数', '地域'],
          match_count: 3,
          matching_details: {
            industry: { expected: '製造業', actual: '製造業', matched: true },
            employee_count: { expected: '500～1000名', actual: '800名', matched: true },
            region: { expected: '関東', actual: '関東', matched: true }
          },
          visibility_text: '過去事例A - 合致属性：業種（製造業）、従業員数（500～1000名）、地域（関東）'
        }
      ],
      is_valid: true
    });
  });
});