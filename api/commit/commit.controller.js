const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const commitService = require('./commit.service')

async function getCommits(req, res) {
    try {
        console.log('req.query: ', req.query);
        const commits = await commitService.query(req.query)
        res.send(commits)
    } catch (err) {
        logger.error('Cannot get commits', err)
        res.status(500).send({ err: 'Failed to get commits' })
    }
}

async function deleteCommit(req, res) {
    try {
        await commitService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete commit', err)
        res.status(500).send({ err: 'Failed to delete commit' })
    }
}


async function addCommit(req, res) {
    try {
        var commit = req.body
        commit.byUserId = req.session.user._id
        commit = await commitService.add(commit)
        commit.byUser = req.session.user
        commit.aboutUser = await userService.getById(commit.aboutUserId)
        res.send(commit)

    } catch (err) {
        logger.error('Failed to add commit', err)
        res.status(500).send({ err: 'Failed to add commit' })
    }
}

module.exports = {
    getCommits,
    deleteCommit,
    addCommit
}