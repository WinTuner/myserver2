"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setServers(['1.1.1.1', '8.8.8.8']);
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const cors_1 = __importDefault(require("cors"));
const node_path_1 = __importDefault(require("node:path"));
exports.app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.static(node_path_1.default.join(__dirname, '../public')));
// Routes
exports.app.use('/api', UserRoutes_1.default);
const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV !== 'test') {
    console.error('MONGODB_URI missing. Set it in .env or environment.');
}
// Connect to MongoDB
if (!uri) {
    if (process.env.NODE_ENV !== 'test') {
        exports.app.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT} (no DB: MONGODB_URI missing)`);
        });
    }
}
else {
    mongoose_1.default
        .connect(uri, {})
        .then(() => {
        console.log('Connected to MongoDB');
        if (process.env.NODE_ENV !== 'test') {
            exports.app.listen(PORT, () => {
                console.log(`Server is running on port http://localhost:${PORT}`);
            });
        }
    })
        .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
exports.default = exports.app;
