import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    id: string; // Added explicitly
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        username: {
            type: String,
            // required: true // TODO: Make required  
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                // We typically keep isAdmin in JSON so frontend knows, but safeguard strictly if needed.
                // Keeping it for now.
            }
        },
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
