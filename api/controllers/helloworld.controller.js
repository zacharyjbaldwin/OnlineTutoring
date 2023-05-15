// default function that returns a 200 OK status and a short message
module.exports.helloWorld = (req, res) => {
    res.status(200).json({
        message: 'Hello world!'
    });
};