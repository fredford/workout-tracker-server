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
// Library imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminjs_1 = __importDefault(require("adminjs"));
const express_2 = __importDefault(require("@adminjs/express"));
const mongoose_2 = __importDefault(require("@adminjs/mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Mongoose Models
const User_1 = require("./models/User");
// Server routes
const routes_1 = __importDefault(require("./routes/routes"));
// Middleware
const errorTransmission_1 = __importDefault(require("./middleware/errorTransmission"));
// Utilities
const variables_1 = require("./utils/variables");
// Read the environment variables
dotenv_1.default.config({ path: "./.env" });
// Instantiate the application with Express
const app = (0, express_1.default)();
// Register the Mongoose Adapter
adminjs_1.default.registerAdapter(mongoose_2.default);
// Run AdminJS with Mongoose
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mongooseDb = yield mongoose_1.default.connect((_a = process.env.WORKOUTTRACKER_DB_URI) !== null && _a !== void 0 ? _a : "");
    // Connect the database to AdminJS for the backend dashboard
    const adminJs = new adminjs_1.default({ databases: [mongooseDb], rootPath: "/admin" });
    const adminJSrouter = express_2.default.buildAuthenticatedRouter(adminJs, {
        // The only authenticated account for admin access is admin@admin.com
        authenticate: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
            if (email === "admin@admin.com") {
                const user = (yield User_1.User.findOne({ email: "admin@admin.com" }).select("+password"));
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
    // Add AdminJS routes to the application
    app.use(adminJs.options.rootPath, adminJSrouter);
    console.log("MongoDB connected");
});
// Connect to MongoDB
connectDB();
// Set CORS
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Instantiate all set routes
routes_1.default.forEach((route) => app.use(variables_1.version, route));
// Error Handler (last piece of middleware added)
app.use(errorTransmission_1.default);
// Set the server port
const PORT = process.env.PORT || 8000;
// If the server is in "test" mode don't listen for normal usage
if (process.env.NODE_ENV !== "test") {
    const index = app.listen(PORT, () => {
        console.log(`Server on ${PORT}`);
    });
    const adminIndex = app.listen(8080, () => {
        console.log(`Admin on ${PORT}`);
    });
    process.on("unhandledRejection", (err, promise) => {
        console.log(`Logged Error: ${err}`);
        adminIndex.close(() => process.exit(1));
        index.close(() => process.exit(1));
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map