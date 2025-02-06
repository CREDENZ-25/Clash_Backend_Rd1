import { Model, DataTypes} from "sequelize";

class User extends Model{}

const initUserModel = sequelize => {
    User.init(
        {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,

            },
            category:{
                type: DataTypes.BOOLEAN,
                allowNull: false,
               
            },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,

        }
        }
   ,{sequelize} );


return User.sync().then(()=> console.log('Created User Table'))
.catch(console.error);
};

export { User, initUserModel };
