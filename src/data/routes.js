const { Router } = require('express');

const router = Router();

router.get("/", controller.getData);

module.exports = router;