import { generateSalesRepActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-156: 同一営業担当者の重複する商談記録が存在するとき、正常に処理される', async () => {
    // テストデータ準備
    const salesRepId = 'SA001';
    const dealRecords = [
      {
        dealId: 'DEAL-001',
        salesRepId: 'SA001',
        customerId: 'CUST-100',
        dealName: '提案A',
        createdDate: '2024-01-15T10:00:00Z',
        contactCount: 3,
        proposalCount: 2,
        closedFlg: true,
        closedDate: '2024-01-20T14:30:00Z'
      },
      {
        dealId: 'DEAL-002',
        salesRepId: 'SA001',
        customerId: 'CUST-101',
        dealName: '提案B',
        createdDate: '2024-01-18T09:00:00Z',
        contactCount: 2,
        proposalCount: 1,
        closedFlg: false,
        closedDate: null
      }
    ];

    // Mock API レスポンス
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const mockReportResponse = {
      success: true,
      reportId: 'RPT-2024-001',
      salesRepId: 'SA001',
      generatedAt: '2024-01-25T12:00:00Z',
      dealRecordsCount: 2,
      analysisResults: {
        totalContactCount: 5,
        totalProposalCount: 3,
        closedDealsCount: 1,
        closedDealsRate: 0.5,
        averageContactCountPerDeal: 2.5,
        averageProposalCountPerDeal: 1.5,
        dealDetails: [
          {
            dealId: 'DEAL-001',
            dealName: '提案A',
            customerId: 'CUST-100',
            contactCount: 3,
            proposalCount: 2,
            closedFlg: true,
            closedDate: '2024-01-20T14:30:00Z'
          },
          {
            dealId: 'DEAL-002',
            dealName: '提案B',
            customerId: 'CUST-101',
            contactCount: 2,
            proposalCount: 1,
            closedFlg: false,
            closedDate: null
          }
        ]
      }
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockReportResponse), { status: 200 });

    // 関数実行
    const result = await generateSalesRepActionPatternAnalysisReport({
      salesRepId: salesRepId,
      dealRecords: dealRecords,
      analysisStartDate: '2024-01-01T00:00:00Z',
      analysisEndDate: '2024-01-31T23:59:59Z'
    });

    // 期待結果の検証
    expect(result.success).toBe(true);
    expect(result.salesRepId).toBe('SA001');
    expect(result.dealRecordsCount).toBe(2);
    expect(result.analysisResults.totalContactCount).toBe(5);
    expect(result.analysisResults.totalProposalCount).toBe(3);
    expect(result.analysisResults.closedDealsCount).toBe(1);
    expect(result.analysisResults.closedDealsRate).toBe(0.5);
    expect(result.analysisResults.averageContactCountPerDeal).toBe(2.5);
    expect(result.analysisResults.averageProposalCountPerDeal).toBe(1.5);
    expect(result.analysisResults.dealDetails.length).toBe(2);
    expect(result.analysisResults.dealDetails[0].dealId).toBe('DEAL-001');
    expect(result.analysisResults.dealDetails[1].dealId).toBe('DEAL-002');
  });
});