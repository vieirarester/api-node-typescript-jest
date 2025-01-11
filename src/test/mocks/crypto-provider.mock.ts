export const mockCryptoUtil = {
    hash: jest.fn((value: string) => `hashed-${value}`),
    generateToken: jest.fn().mockReturnValue('mocked_token'),
}