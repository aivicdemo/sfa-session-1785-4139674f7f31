import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2780
  test('顧客規模が欠けている商談レコードが含まれるとき、エラーを返す', () => {
    const dealRecords = [
      {
        dealId: 'DEAL001',
        customerId: 'CUST001',
        customerName: '株式会社A',
        industry: 'IT',
        customerSize: 'Large',
        dealAmount: 5000000,
        dealStage: 'Closed Won',
        closedDate: '2024-01-15',
      },
      {
        dealId: 'DEAL002',
        customerId: 'CUST002',
        customerName: '株式会社B',
        industry: 'Manufacturing',
        customerSize: null,
        dealAmount: 3000000,
        dealStage: 'Closed Won',
        closedDate: '2024-01-20',
      },
      {
        dealId: 'DEAL003',
        customerId: 'CUST003',
        customerName: '株式会社C',
        industry: 'Finance',
        customerSize: 'Medium',
        dealAmount: 2000000,
        dealStage: 'Closed Won',
        closedDate: '2024-01-25',
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const result = findSimilarPatterns(dealRecords, mockAIEngine);

    expect(result).toEqual({
      type: 'ValidationError',
      message: '商談レコードに必須フィールド「顧客規模（customerSize）」が不足しています。レコード位置: 1',
      statusCode: 400,
    });
  });
});