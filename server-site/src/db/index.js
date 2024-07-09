import  mongoose from "mongoose";

export const dbConnect = async ()=> {
    try{
      const connection = await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongodb connected ", connection)
    } catch(err) {
      console.log("mongobd error", err.message);
    }

}
