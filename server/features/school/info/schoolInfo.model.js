import mongoose from 'mongoose';

const schoolInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    establishedYear: {
        type: Number,
    },
    motto: {
        type: String,
    },
    email: {
        type: String,
    },
    quote: {
        type: String,
    },
    
    logo: {
        type: String, 
    },
    heroImage: {
        type: String, 
    },

    mobile: {
        type: String,
    },
    website: {
        type: String,
    },
    actionLabel: {
        type: String,
    },
    actionLink: {
        type: String,
    }
}, {
    timestamps: true
});

const SchoolInfo = mongoose.model('SchoolInfo', schoolInfoSchema);

export default SchoolInfo;