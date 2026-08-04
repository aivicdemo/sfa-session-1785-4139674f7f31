import { validatePhoneNumbers } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-654
  test('電話番号が複数件のとき、すべて入力受け付けが完了する', async () => {
    const phoneNumbers = ['09012345678', '09087654321', '0312345678'];

    const mockValidator = jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
    });

    const mockApiCall = jest.fn().mockResolvedValue({
      status: 200,
      success: true,
      message: '顧客情報が正常に保存されました',
    });

    const result = await validatePhoneNumbers(
      phoneNumbers,
      mockValidator,
      mockApiCall
    );

    expect(mockValidator).toHaveBeenCalledWith(phoneNumbers);
    expect(mockValidator).toHaveBeenCalledTimes(1);
    expect(Array.isArray(phoneNumbers)).toBe(true);
    expect(phoneNumbers).toHaveLength(3);
    expect(phoneNumbers[0]).toBe('09012345678');
    expect(phoneNumbers[1]).toBe('09087654321');
    expect(phoneNumbers[2]).toBe('0312345678');

    expect(mockApiCall).toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.message).toBe('顧客情報が正常に保存されました');
  });
});