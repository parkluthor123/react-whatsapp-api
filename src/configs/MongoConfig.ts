import mongoose from 'mongoose';

export default {
    connect: async () => {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.MONGO_URI as string,{
            //@ts-ignore 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DATABASE
        })
    },
    mongo:  mongoose
}