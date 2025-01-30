//id question answer category 

import {STRING , INTEGER , ENUM , TEXT , Model, Sequelize,ARRAY, BOOLEAN, DataTypes} from 'sequelize';

class MCQ extends Model{};

const initMCQModel=sequelize=>{
    MCQ.init({
        id:{
            type:INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        questions:{
            type:STRING,
            allowNull:false,
            
        },
        options:{
            type:DataTypes.ARRAY(DataTypes.STRING),
            allowNull:false
        },
        correct:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate: {
                isIn: [[0, 1, 2, 3]] // Sequelize's validation for allowed values
            }
        },
        isJunior:{
            type:DataTypes.BOOLEAN,
        }




    }, {sequelize});

    
    return MCQ.sync().then(()=>console.log("MCQ table created !"))
    .catch(()=>console.log("table not created" , err));
};

export {MCQ, initMCQModel};
