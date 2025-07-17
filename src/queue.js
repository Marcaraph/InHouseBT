const gameLocks = new Map();

async function withGameLock(gameId, callback) {
    const previous = gameLocks.get(gameId) || Promise.resolve();

    let release;
    const current = new Promise((resolve) => (release = resolve));
    gameLocks.set(gameId, previous.then(() => current));

    try {
        return await callback();
    } finally {
        release();
        if (gameLocks.get(gameId) === current) {
            gameLocks.delete(gameId);
        }
    }
}

module.exports = { withGameLock };