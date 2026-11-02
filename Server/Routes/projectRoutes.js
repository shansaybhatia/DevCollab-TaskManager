const express = require('express');
const router = express.Router();
const projectController =  require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

router.post('/:id/invite', projectController.inviteMember);
router.delete('/:id/members/:userId', projectController.removeMember);

module.exports = router;
