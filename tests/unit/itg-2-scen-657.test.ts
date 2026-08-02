import { visualizeRecommendationWithBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-657
  test('推奨内容根拠の可視化機能 - 商談詳細から抽出した推奨内容が存在するとき、その推奨内容が根拠データと組み合わせられる', () => {
    const deal_detail_input = {
      deal_id: 'D001',
      customer_name: 'ABC株式会社',
      recommendation_content: 'クラウド型ERPシステムの導入'
    };

    const basis_data_input = {
      basis_type: '売上成長率',
      basis_value: '前年比150%',
      calculation_date: '2024-01-15'
    };

    const result = visualizeRecommendationWithBasis(
      deal_detail_input.deal_id,
      deal_detail_input.customer_name,
      deal_detail_input.recommendation_content,
      basis_data_input.basis_type,
      basis_data_input.basis_value,
      basis_data_input.calculation_date
    );

    expect(result).toEqual({
      deal_id: 'D001',
      recommendation_card: {
        recommendation_content: 'クラウド型ERPシステムの導入',
        basis_information: {
          basis_type: '売上成長率',
          basis_value: '前年比150%',
          calculation_date: '2024-01-15'
        }
      },
      is_visible: true
    });

    expect(result.recommendation_card.recommendation_content).toBe('クラウド型ERPシステムの導入');
    expect(result.recommendation_card.basis_information.basis_type).toBe('売上成長率');
    expect(result.recommendation_card.basis_information.basis_value).toBe('前年比150%');
    expect(result.recommendation_card.basis_information.calculation_date).toBe('2024-01-15');
    expect(result.is_visible).toBe(true);
  });
});