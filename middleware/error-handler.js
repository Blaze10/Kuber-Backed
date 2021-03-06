exports.errorHandler = (err, res) => {
    let errorMessage = 'Some error occured, Please try again later';
    if (err.message) {
        errorMessage = err.message;
    }
    res.status(404).json({
        message: errorMessage,
        status: 0,
    });
}