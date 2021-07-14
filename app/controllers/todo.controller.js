var moment = require('moment');
const db = require("../models");
const { validationResult } = require('express-validator');
const fn = db.Sequelize.fn;
const Op = db.Sequelize.Op;
const col = db.Sequelize.col;
const Todo = db.todo;
const User = db.user;

exports.get = async (req, res) => {
    const teamleadId = req.userId;
    const assignee = req.query.assignee;
    const completeDate = req.query.completeDate;
    let whereClause = {};

    if (assignee != "all") {
        let teamleadAssigneesIds = (await User.findAll({
            where: {
                teamleadId: teamleadId
            },
            attributes: ["id"]
        })).map(user => user.id);
        whereClause.assigneeId = teamleadAssigneesIds;

    }

    if (completeDate !== "all") {
        let beginDate = moment().utcOffset(0).startOf('day');
        let endDate;
        switch (completeDate) {
            case "day":
                endDate = beginDate.clone().endOf('day');
                break;
            case "week":
                endDate = beginDate.clone().endOf('week');
                break;
        }
        whereClause.completeDate = {
            [Op.gt]: beginDate.toDate(),
            ...(endDate && { [Op.lt]: endDate.toDate() })
        };
    }

    Todo.findAll({
        include: { model: User, as: "Assignee", attributes: ["id", "login", [fn('CONCAT', col('surname'), ' ', col('name'), ' ', col('middlename')), 'fullname']] },
        where: whereClause,
        order: [['updatedAt', 'DESC']],
        attributes: {
            exclude: ['assigneeId']
        },
    }).then(data => {
        res.status(200).send(data);
    });
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findByPk(id, {
        include: { model: User, as: "Assignee", attributes: ["id", "login", [fn('CONCAT', col('surname'), ' ', col('name'), ' ', col('middlename')), 'fullname']] }
    });
    if (todo === null) {
        return res.status(404).send("Not found");
    }
    res.status(200).send(todo);
}

exports.updateById = async (req, res) => {
    const id = req.params.id;
    const userRole = req.role;
    let data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (userRole === "employee") {
        data = { status: data.status }
    }

    try {
        await Todo.update(
            { ...data },
            { where: { id } }
        )
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
}

exports.addTodo = async (req, res) => {
    const userId = req.userId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const assigneeId = parseInt(req.body.assigneeId);
    const assigneesIds = await User.findAll({
        where: {
            teamleadId: userId
        },
        attributes: ["id"],
    }).map(assignee => assignee.id);
    if (!assigneesIds.includes(assigneeId)) {
        return res.status(400).json("указанный ответственный пользователь не является подчинённым текущего руководителя");
    }

    const completeDate = moment(req.body.completeDate).utcOffset(0).toString();

    const todo = {
        ...req.body,
        completeDate,
        initiatorId: userId,
        status: "todo"
    }
    try {
        await Todo.create({ ...todo });
        res.status(200).send('success');
    } catch (err) {
        res.status(500);
    }
}
