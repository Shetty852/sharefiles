import cron from "node-cron";
import fs from "fs";
import path from "path";
import { File } from "./models/file.model.js";

cron.schedule("*/1 * * * *", async () => {
    const now = Date.now();
    const EXPIRY = 5 * 60 * 1000; 
    try {
        const files = await File.find();

        for (const file of files) {
            const createdAt = new Date(file.createdAt).getTime();
            if (now - createdAt > EXPIRY) {
                const filename = path.basename(file.file);
                const filePath = path.join("public/temp", filename);

                fs.unlink(filePath, async (err) => {
                    if (!err) {
                        await File.deleteOne({ _id: file._id });
                        console.log(`Deleted expired file: ${filename}`);
                    }
                });
            }
        }
    } catch (err) {
        console.error("Cron job failed:", err.message);
    }
});
