
async function controllerPostCode(req,res){
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(400).send("Code is required please");
        }
        const response = await aiService(code);
        if (response.includes("The LLM is currently busy")) {
            return res.status(503).send(response);
        }

        res.send(response);
    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
}

export { controllerPostCode };

