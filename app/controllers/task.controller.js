const { Task, User, UserTask } = require("../sequelize");
const { isRequestEmpty } = require("../utils/requests.utils");

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        return res.status(400).json({
            message: "Request body is empty",
        });
    }

    const { signature } = req.body;

    if (!signature) {
        return res.status(400).json({
            message: "Signature is required",
        });
    }

    const task = await Task.create({ signature });

    if (!task) {
        return res.status(500).json({
            message: "An error occurred while creating the task",
        });
    }

    return res.json({
        message: "Task created successfully",
    });
};

exports.read = async (req, res) => {
    const { signature } = req.params;

    if (!signature) {
        return res.status(400).json({
            message: "Signature is required",
        });
    }

    const task = await Task.findOne({
        where: {
            signature,
        },
        include: [
            {
                model: User,
                as: "users",

            }
        ]
    });

    if (!task) {
        return res.status(404).json({
            message: "Task not found",
        });
    }

    return res.json({
        data: {
            task,
        },
        message: "Task found successfully",
    });
};