var moment = require('moment');
const { authJwt } = require("../middleware");
const controller = require("../controllers/todo.controller");
const { body } = require('express-validator');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/todo",
        [authJwt.verifyToken],
        controller.get);

    app.get("/api/todo/:id",
        [authJwt.verifyToken],
        controller.getById);

    app.post("/api/todo",
        [authJwt.verifyToken, authJwt.isTeamlead],
        todoValidationRules.title,
        todoValidationRules.description,
        todoValidationRules.description,
        todoValidationRules.completeDate,
        todoValidationRules.priority,
        todoValidationRules.assigneeId,
        controller.addTodo);

    app.put("/api/todo/:id",
        [authJwt.verifyToken],
        todoValidationRules.title.optional(),
        todoValidationRules.description.optional(),
        todoValidationRules.description.optional(),
        todoValidationRules.completeDate.optional(),
        todoValidationRules.priority.optional(),
        todoValidationRules.status.optional(),
        todoValidationRules.assigneeId.optional(),
        controller.updateById);
};

const todoValidationRules = {
    title: body('title').isLength({ min: 1 }),
    description: body('description').isLength({ min: 1 }),
    completeDate: body('completeDate').custom(value => {
        const isValid = moment("2021-07-13T05:00:00.109Z", moment.ISO_8601, true).isValid();
        if (!isValid) {
            throw new Error('Invalid date');
        }
        return true;
    }),
    priority: body('priority').isIn(['high', 'medium', 'low']),
    status: body('status').isIn(['todo', 'inProgress', 'completed', 'canceled']),
    assigneeId: body('assigneeId').isInt({ min: 1 })
}