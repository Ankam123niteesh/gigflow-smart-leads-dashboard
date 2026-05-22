import { Schema, model } from 'mongoose';
const leadSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost'],
        default: 'New',
        required: true,
    },
    source: {
        type: String,
        enum: ['Website', 'Instagram', 'Referral'],
        default: 'Website',
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
export const Lead = model('Lead', leadSchema);
