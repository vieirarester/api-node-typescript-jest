export const mockCryptoUtil = {
    hash: jest.fn((value: string) => `hashed-${value}`),
    generateToken: jest.fn((payload: object) => "mock-token"),
}