import { recordCustomerReaction } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-437
  test('顧客との接触が完了していない状態で反応を記録しようとしたときエラーが発生する', async () => {
    const contactId = 'CONTACT-20240115-0001';
    const customerId = 'CUST-20240115-001';
    const salesPersonId = 'SALES-0042';
    const incompleteStatus = '未完了';
    const reactionType = '興味あり';
    const reactionNotes = 'テスト反応記録';

    const payload = {
      contactId,
      customerId,
      salesPersonId,
      contactStatus: incompleteStatus,
      reactionType,
      reactionNotes,
    };

    await expect(async () => {
      await recordCustomerReaction(payload);
    }).rejects.toThrow(/接触完了/);
  });
});