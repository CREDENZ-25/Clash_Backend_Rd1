import { UserModel } from "../config/db.js";
import { ProgressModel } from "../config/db.js";
import { calculateRank } from "../controllers/leaderboardcontroller.js";

const submit = async (req, res) => {
  const userId = req.user.userId;
  const isJunior = req.user.isJunior;
  if (!userId) {
    return res.status(400).json({ message: "User ID not found!" });
  }
  let submitData;
  let userdata;

  // userdata = await UserModel.findOne({
  //     attributes:["username","email"],
  //     where:{
  //         userid: userId
  //     }
  // })

  submitData = await ProgressModel.findOne({
    attributes: ["Counter", "Corrects", "Marks"],
    where: {
      userid: userId,
    },
    include: [
      {
        model: UserModel,
        as: "users",
        attributes: ["username","email"],
      },
    ],
  });
  // console.log(submitData.Corrects/submitData.Counter)
  const { juniorLeaderboard, seniorLeaderboard, userRank } =
    await calculateRank(userId, isJunior);
  const accuracy = (submitData.Corrects / submitData.Counter) * 100;
  return res.status(200).json({
    Attempted: submitData.Counter,
    "Correct Questions": submitData.Corrects,
    Score: submitData.Marks,
    Accuracy: accuracy + "%",
    Rank: userRank,
    username: submitData.users.username,
    email: submitData.users.email,
  });
};

export default submit;
