"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminjs_1 = __importDefault(require("adminjs"));
const express_2 = __importDefault(require("@adminjs/express"));
const mongoose_2 = __importDefault(require("@adminjs/mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes/routes"));
const error_1 = __importDefault(require("./middleware/error"));
const User_1 = require("./models/User");
dotenv_1.default.config({ path: "./.env" });
const version = "/api/v1";
const app = (0, express_1.default)();
// Register the Mongoose Adapter
adminjs_1.default.registerAdapter(mongoose_2.default);
// Run AdminJS with Mongoose
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mongooseDb = yield mongoose_1.default.connect((_a = process.env.WORKOUTTRACKER_DB_URI) !== null && _a !== void 0 ? _a : "");
    const adminJs = new adminjs_1.default({ databases: [mongooseDb], rootPath: "/admin" });
    const adminJSrouter = express_2.default.buildAuthenticatedRouter(adminJs, {
        authenticate: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
            if (email === "admin@admin.com") {
                const user = yield User_1.User.findOne({ email: "admin@admin.com" }).select("+password");
                const isMatch = yield user.matchPasswords(password);
                if (isMatch) {
                    return user;
                }
                return false;
            }
        }),
        cookiePassword: "some-secret-password",
    }, null, {
        resave: false,
        saveUninitialized: true,
    });
    app.use(adminJs.options.rootPath, adminJSrouter);
    console.log("MongoDB connected");
});
// Connect to MongoDB
connectDB();
// Set CORS
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Instantiate all set routes
routes_1.default.forEach((route) => app.use(version, route));
// Error Handler (last piece of middleware added)
app.use(error_1.default);
const PORT = process.env.PORT || 8000;
const index = app.listen(app.listen(PORT, () => console.log(`Server running on port ${PORT}`)), app.listen(8080, () => console.log("AdminJS is under localhost:8080/admin")));
process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err}`);
    index.close(() => process.exit(1));
});
exports.default = app;
