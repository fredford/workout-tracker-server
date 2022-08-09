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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const Workout_1 = __importDefault(require("./Workout"));
const Set_1 = __importDefault(require("./Set"));
const Exercise_1 = __importDefault(require("./Exercise"));
// Model Schema for Users
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
    },
    theme: {
        type: String,
        default: "light",
        enum: ["light", "dark"],
    },
    location: {
        type: String,
        required: [true, "No location provided"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        next();
    });
});
UserSchema.pre("deleteOne", function deleteOne(next) {
    const user = this;
    Set_1.default.deleteMany({ user: { _id: this._id } })
        .then(() => {
        console.log("Done");
    })
        .catch((error) => {
        console.log(error);
    });
    Workout_1.default.deleteMany({ user: { _id: this._id } })
        .then(() => {
        console.log("Done");
    })
        .catch((error) => {
        console.log(error);
    });
    Exercise_1.default.deleteMany({ user: { _id: this._id } })
        .then(() => {
        console.log("Done");
    })
        .catch((error) => {
        console.log(error);
    });
    next();
});
UserSchema.methods.matchPasswords = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
UserSchema.methods.getSignedToken = function () {
    var _a;
    return jsonwebtoken_1.default.sign({ id: this.id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "", {
        expiresIn: `${process.env.JWT_EXPIRE}`,
    });
};
UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 60 * (60 * 1000);
    return resetToken;
};
exports.User = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.js.map