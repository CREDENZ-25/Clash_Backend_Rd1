import { Model, DataTypes, BOOLEAN, ARRAY} from "sequelize";
import {User} from './User.js';
class Progress extends Model{}

const initProgressModel = sequelize => {
    Progress.init(
        {
        Questionsid: {
            type:DataTypes.ARRAY(DataTypes.INTEGER),
          

        },
        Selectedans:{
            type:DataTypes.ARRAY(DataTypes.INTEGER),
          
        },
        Correctans:{
            type:DataTypes.ARRAY(DataTypes.INTEGER),
           
        },
        Marks:{
            type:DataTypes.INTEGER,
        },
        Counter:{
            type:DataTypes.INTEGER,
            
        },
        isJunior:{
            type:BOOLEAN
        },
        isUsedLifelines: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),  // Store question IDs (default: [-1, -1, -1])
            allowNull: false,
            defaultValue: [-1, -1, -1]
}

        }
   ,{sequelize} );
   Progress.belongsTo(User, {
    foreignKey: 'userid', //taking name of foreign key
    });

return Progress.sync().then(()=> console.log('Created Progress Table'))
.catch(console.error);
};

export { Progress, initProgressModel }
