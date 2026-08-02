import { fetchRecommendationEvidenceCases } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-647: 推奨内容根拠の可視化機能 - 推奨アプローチに関連する過去事例が複数件のとき、すべての事例データが正しく抽出される', async () => {
    const mockCases = [
      {
        case_id: 'CASE-001',
        approach_type: 'クロスセル提案',
        contract_amount: 1500000,
        contract_date: '2024-01-15',
        customer_id: 'CUST-999',
        industry: '製造業',
        company_size: '中堅企業',
      },
      {
        case_id: 'CASE-002',
        approach_type: 'クロスセル提案',
        contract_amount: 2000000,
        contract_date: '2024-02-20',
        customer_id: 'CUST-999',
        industry: '製造業',
        company_size: '中堅企業',
      },
      {
        case_id: 'CASE-003',
        approach_type: 'クロスセル提案',
        contract_amount: 1200000,
        contract_date: '2024-03-10',
        customer_id: 'CUST-999',
        industry: '製造業',
        company_size: '中堅企業',
      },
    ];

    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(JSON.stringify({ cases: mockCases }), {
      status: 200,
    });

    const result = await fetchRecommendationEvidenceCases({
      approach_type: 'クロスセル提案',
      customer_id: 'CUST-999',
    });

    expect(result.cases).toHaveLength(3);

    expect(result.cases[0]).toEqual({
      case_id: 'CASE-001',
      approach_type: 'クロスセル提案',
      contract_amount: 1500000,
      contract_date: '2024-01-15',
      customer_id: 'CUST-999',
      industry: '製造業',
      company_size: '中堅企業',
    });

    expect(result.cases[1]).toEqual({
      case_id: 'CASE-002',
      approach_type: 'クロスセル提案',
      contract_amount: 2000000,
      contract_date: '2024-02-20',
      customer_id: 'CUST-999',
      industry: '製造業',
      company_size: '中堅企業',
    });

    expect(result.cases[2]).toEqual({
      case_id: 'CASE-003',
      approach_type: 'クロスセル提案',
      contract_amount: 1200000,
      contract_date: '2024-03-10',
      customer_id: 'CUST-999',
      industry: '製造業',
      company_size: '中堅企業',
    });

    expect(result.cases[0].case_id).toBe('CASE-001');
    expect(result.cases[0].approach_type).toBe('クロスセル提案');
    expect(result.cases[0].contract_amount).toBe(1500000);
    expect(result.cases[0].contract_date).toBe('2024-01-15');

    expect(result.cases[1].case_id).toBe('CASE-002');
    expect(result.cases[1].approach_type).toBe('クロスセル提案');
    expect(result.cases[1].contract_amount).toBe(2000000);
    expect(result.cases[1].contract_date).toBe('2024-02-20');

    expect(result.cases[2].case_id).toBe('CASE-003');
    expect(result.cases[2].approach_type).toBe('クロスセル提案');
    expect(result.cases[2].contract_amount).toBe(1200000);
    expect(result.cases[2].contract_date).toBe('2024-03-10');
  });
});