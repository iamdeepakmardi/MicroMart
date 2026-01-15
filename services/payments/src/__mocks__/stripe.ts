export const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({ id: 'ch_test_mock_id' })
    }
};
