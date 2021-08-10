const asyncHandler = fn => (req, res, next) => {
    Promise
    .resolve(fn(req, res, next))
    .catch(next) // Errors will be passed to Express.
}

module.exports = asyncHandler;

   