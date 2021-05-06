const DBService = require('../../services/db.service')


function query(criteria={}) {
    console.log('criteria', criteria);
    var userName = criteria.byUserName.length ? ` AND users.fullname = '${criteria.byUserName}'` : '';

    var repositoryName = criteria.byRepositoryName.length ? ` AND repository.name = '${criteria.byRepositoryName}'` : '';

    var query = `SELECT commit._id, commit.text, commit.committedAt, users.fullname, repository.name
    FROM commit, users, repository
    WHERE commit.byUser = users._id
    AND commit.repositoryId = repository._id${userName}${repositoryName}`;
    console.log('query: ', query);
    return DBService.runSQL(query)
}

// function query(criteria={}) {
//     var namePart = criteria.name || '';
//     var query = `SELECT * FROM commit  WHERE commit.name LIKE '%${namePart}%'`;

//     return DBService.runSQL(query)
// }

async function getById(commitId) {
    var query = `SELECT * FROM commit WHERE commit._id = ${commitId}`;

    var commits = await DBService.runSQL(query);
    if (commits.length === 1) return commits[0];
    throw new Error(`commit id ${commitId} not found`);
}
// // not using async/await:
// function getById(commitId) {
//     var query = `SELECT * FROM commit WHERE commit._id = ${commitId}`;

//     return DBService.dbConnect(query)
//             .then(commits => commits.length === 1
//                 ? commits[0]
//                 : Promise.reject(new Error(`id ${commitId} was either not found or matched too many results`)));
// }

function add(commit) {
    var query = `INSERT INTO commit (name, description, severity, creator) 
                VALUES ("${commit.name}",
                        "${commit.description}",
                        "${commit.severity}",
                        "${commit.creator}")`;
    
    return DBService.runSQL(query)
}


async function update(commit) {
    var query = `UPDATE commit set name = "${commit.name}",
                                description = "${commit.description}",
                                severity = ${commit.severity}
                WHERE commit._id = ${commit._id}`;

    var okPacket = await DBService.runSQL(query);
    if (okPacket.affectedRows !== 0) return okPacket;
    throw new Error(`No commit updated - commit id ${commit._id}`);
}
// // not using async/await:
// function update(commit) {
//     var query = `UPDATE commit set name = "${commit.name}",
//                                 description = "${commit.description}",
//                                 severity = ${commit.severity}
//                 WHERE commit._id = 675`;

//     return DBService.dbConnect(query)
//             .then(okPacket => okPacket.affectedRows !== 0
//                 ? okPacket
//                 : Promise.reject(new Error('No commit was updated')));
// }

function remove(commitId) {
    var query = `DELETE FROM commit WHERE commit._id = ${commitId}`;

    return DBService.runSQL(query)
            .then(okPacket => okPacket.affectedRows === 1
                ? okPacket
                : Promise.reject(new Error(`No commit deleted - commit id ${commitId}`)));
}


module.exports = {
    query,
    getById,
    add,
    update,
    remove
}