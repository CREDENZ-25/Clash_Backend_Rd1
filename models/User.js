import { Model, ENUM, STRING, TEXT, INTEGER} from "sequelize";

class Clash extends Model{}

const initClashModel = sequelize => {
    Clash.init(
        {
            id:{
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,

            },
        email:{
            type: STRING({length:256}),
            allowNull: false,
            unique: true,
            
        },
        password: {
            type: STRING({length: 256}),
            allowNull: false,
            
        }
        }
   ,{sequelize} );


return Clash.sync().then(()=> console.log('Created User Table'))
.catch(console.error);
};

export { Clash, initClashModel };