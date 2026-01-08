import express from 'express';
import { controllerPostCode } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/post-code',controllerPostCode);

// this is a temporary route for stress testing
router.post('/stress-test', async (req, res) => {
    // 1. Simulate the delay of AI (e.g., 2 seconds)
    // This keeps the connection open, occupying your server's RAM/CPU connection slot
    await new Promise(resolve => setTimeout(resolve, 5000));

    res.send({
        "review": "This is a FAKE review for stress testing. Your server handled this perfectly! 🚀"
    });
});

export default router;

