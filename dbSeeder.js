
var bcrypt = require("bcryptjs")
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


module.exports = async function initial(db) {
    const User = db.user;
    const Todo = db.todo;
    const now = Date();
    const priorities = ['high', 'medium', 'low'];
    const statuses = ['todo', 'inProgress', 'completed', 'canceled'];

    let fullname = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }).split('_');
    await User.create({
        name: fullname[0],
        middlename: fullname[1],
        surname: fullname[2],
        role: "teamlead",
        login: "user1",
        password: bcrypt.hashSync("123456", 8),
    });

    fullname = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }).split('_');
    await User.create({
        name: fullname[0],
        middlename: fullname[1],
        surname: fullname[2],
        role: "teamlead",
        login: "user2",
        password: bcrypt.hashSync("123456", 8),
    });

    for (let i = 3; i <= 7; i++) {
        const fullname = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }).split('_');
        await User.create({
            name: fullname[0],
            middlename: fullname[1],
            surname: fullname[2],
            role: "employee",
            login: `user${i}`,
            password: bcrypt.hashSync("123456", 8),
            teamleadId: 1
        });
    }

    for (let i = 8; i <= 13; i++) {
        const fullname = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }).split('_');
        await User.create({
            name: fullname[0],
            middlename: fullname[1],
            surname: fullname[2],
            role: "employee",
            login: `user${i}`,
            password: bcrypt.hashSync("123456", 8),
            teamleadId: 2
        });
    }

    for (let i = 1; i <= 50; i++) {
        await Todo.create({
            title: `Задача №${i}`,
            description: "Описание задачи",
            completeDate: randomDate(),
            priority: priorities[getRandomInt(0, 2)],
            status: statuses[getRandomInt(0, 3)],
            initiatorId: 1,
            assigneeId: getRandomInt(3, 7),
        });
    }

    for (let i = 51; i <= 100; i++) {
        await Todo.create({
            title: `Задача № ${i}`,
            description: "Описание задачи",
            completeDate: randomDate(),
            priority: priorities[getRandomInt(0, 2)],
            status: statuses[getRandomInt(0, 3)],
            initiatorId: 2,
            assigneeId: getRandomInt(8, 13),
        });
    }
}

function randomDate() {
    var result = new Date();
    result.setDate(getRandomInt(-31, 31));
    result.setHours(getRandomInt(0, 23));
    result.setMinutes(getRandomInt(0, 59));
    return result;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


