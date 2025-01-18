//id question answer category 

import {STRING , INTEGER , ENUM , TEXT , Model, Sequelize,ARRAY, BOOLEAN} from 'sequelize';

class MCQ extends Model{};

const initMCQmodel=sequelize=>{
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
        answer:{
            type:STRING,
            allowNull:false
        },
        options:{
            type:ARRAY,
            allowNull:false,
         },
        isJunior:{
            type:BOOLEAN,
            allowNull:false,
        }




    }, {sequelize});

    
    return MCQ.sync().then(()=>console.log("MCQ table created !"))
    .catch(()=>console.log("table not created" , err));
};

export default(MCQ, initMCQmodel);
