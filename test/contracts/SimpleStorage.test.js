const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", (accounts) => {
    before(async () => {
        instance = await SimpleStorage.deployed();
    });

    it("ensures that user can add their favorite number", async () => {
        await instance.store(10);
        let favoriteNumber = await instance.myFavoriteNumber();
        assert.equal(favoriteNumber, 10, "The favorite number should be 10.");
    });
});