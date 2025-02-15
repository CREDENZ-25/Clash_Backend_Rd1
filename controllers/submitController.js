import { UserModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";

const submit = async (req, res) => {
  
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found!" });
    }
    let submitData;

    submitData= await ProgressModel.findOne({
    attributes:["Counter","Corrects","Marks"],
    where: {
        userid: userId
    }
    })
    

    return res.status(200).json({
        "Attempted":submitData.Counter,
        "Correct Questions": submitData.Corrects,
        "Score": submitData.Marks,
        "Accuracy": Math.round((submitData.Corrects/submitData.Counter))*100+"%",

    });
  
};

export default submit;
