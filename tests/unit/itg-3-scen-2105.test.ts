import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2105
  test('提案内容と標準プロセスの乖離度算出 - 営業担当者IDが空文字列のときエラーが発生する', () => {
    const emptyEmployeeId = '';
    const validCustomerInfo = {
      customerId: 'CUST-001',
      industryType: '製造業',
      companySize: '大企業',
    };
    const validDealConditions = {
      dealId: 'DEAL-001',
      dealStage: '提案段階',
      proposalContent: 'システム導入提案',
    };

    expect(() => {
      calculateProposalProcessDeviation(
        emptyEmployeeId,
        validCustomerInfo,
        validDealConditions
      );
    }).toThrow(/営業担当者ID/);
  });
});