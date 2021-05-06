const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addCommit, getCommits, deleteCommit} = require('./commit.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getCommits)
router.post('/',  requireAuth, addCommit)
router.delete('/:id',  requireAuth, deleteCommit)

module.exports = router